---
name: environment-and-secrets
description: Guide for agents working on direnv configuration, SOPS-encrypted secrets, and environment variable management. Contains critical pitfalls and diagnostic procedures.
---

# Skill: Environment & Secrets Management

## Objective
To guide agents working on direnv configuration, SOPS-encrypted secrets, and environment variable management in this project. This skill captures hard-won lessons and architectural decisions so future agents avoid known pitfalls.

## Architecture Overview

This project uses a **layered environment** with **encrypted secrets**:

```
~/.config/sops/age/keys.txt          ← age private key (never committed)
~/.config/direnv/direnv.toml          ← global direnv settings

lastobelus-2025/.envrc                ← parent: shared API keys (GROQ, OPENROUTER, etc.)
  └── karen-learns-ai/.envrc          ← child: identity, git config, SOPS auto-decrypt
        └── secrets.enc.env           ← SOPS-encrypted secrets (committed to repo)
        └── .sops.yaml                ← SOPS config (age public key, file patterns)
```

**How it works on `cd`:**
1. direnv hook fires in zsh
2. `.envrc` runs `source_up_if_exists` to inherit parent variables
3. `.envrc` sets project identity (Karen's name, email, git author)
4. `.envrc` decrypts `secrets.enc.env` via SOPS and exports the values
5. `KAREN_GH_TOKEN` from secrets is mapped to `GH_TOKEN` for `gh` CLI

## Critical Rules

### 🚨 The SOPS eval Bug (NEVER reintroduce this)
When decrypting secrets with `sops decrypt --output-type dotenv`, the output includes **comment lines** (`# description`). If you pipe this through `sed 's/^/export /'`, comments become `export # comment` which bash interprets as bare `export` — dumping the entire environment to stdout. This **corrupts direnv's capture pipeline**, causing hundreds of `declare -x` lines to spill to the terminal on every `cd`.

**The fix:** Always filter sops output to valid KEY=VALUE lines before adding `export`:
```bash
# ✅ CORRECT — filter to valid assignments only
_secrets=$(sops decrypt --output-type dotenv secrets.enc.env 2>/dev/null \
  | grep -E '^[A-Za-z_][A-Za-z0-9_]*=' \
  | sed 's/^/export /')

# ❌ WRONG — comments become bare `export`, dumping entire env
_secrets=$(sops decrypt --output-type dotenv secrets.enc.env 2>/dev/null \
  | sed 's/^/export /')
```

### 🚨 DIRENV_LOG_FORMAT Cannot Be Set Inside .envrc
`DIRENV_LOG_FORMAT` is read by direnv's **shell hook** (`eval "$(direnv export zsh)"`), not during `.envrc` evaluation. Setting it inside `.envrc` only affects *future* directory changes after the variable is already in the environment — it cannot suppress output for the current load. Do not add `DIRENV_LOG_FORMAT` to `.envrc`.

**The correct approach:** Use `~/.config/direnv/direnv.toml`:
```toml
[global]
hide_env_diff = true
```

### 🚨 `log_status() { :; }` Is Not a Real direnv Function
This was previously used to try to silence direnv. It is not part of direnv's stdlib and should not be added.

## When Modifying `.envrc`

1. **Test with `direnv export zsh`** — run this and check that stdout has valid zsh export commands and stderr has only the 2 `direnv: loading` lines:
   ```bash
   direnv export zsh > /tmp/out.txt 2> /tmp/err.txt
   # stdout should have typeset/export commands
   # stderr should have ONLY "direnv: loading ..." lines
   ```
2. **Re-allow after changes** — run `direnv allow` after any `.envrc` modification.
3. **Use `source_up_if_exists`** (not `source_up`) — avoids errors if no parent `.envrc` is found.
4. **Never output to stdout** — direnv captures stdout from `.envrc` evaluation. Any unexpected stdout (like bare `export`, `echo`, or `cat`) will corrupt the environment diff.

## When Modifying Secrets

1. **Edit encrypted secrets** with `sops secrets.enc.env` (opens in `$EDITOR`, re-encrypts on save).
2. **Adding a new secret:**
   - Add `KEY=value` in the sops editor (no comments on the same line as values).
   - If the new secret needs to be available as a different env var name, add a mapping line in `.envrc` after the `eval` block (like `export GH_TOKEN="$KAREN_GH_TOKEN"`).
3. **Comments in `secrets.enc.env`** are fine — SOPS preserves them. The `grep` filter in `.envrc` safely skips them during decryption.
4. **The age public key** is in `.sops.yaml`. The private key lives at `~/.config/sops/age/keys.txt` (permissions 600).
5. **`watch_file secrets.enc.env`** in `.envrc` ensures direnv reloads when secrets change.

## Parent `.envrc` (lastobelus-2025/)

The parent `.envrc` contains shared API keys used across multiple projects (GROQ, OpenRouter, Context7, etc.) in **plain text**. These are NOT encrypted with SOPS because:
- They are shared across sibling projects (not karen-specific)
- The parent directory is not a git repository (no risk of committing to a remote)

**Do not move parent keys into `secrets.enc.env`** unless the sharing model changes.

## File Reference

| File | Purpose |
|------|---------|
| `.envrc` | direnv config: identity, git author, SOPS auto-decrypt |
| `.sops.yaml` | SOPS config: age public key, `*.enc.env` pattern |
| `secrets.enc.env` | Encrypted secrets (committed to repo) |
| `~/.config/sops/age/keys.txt` | age private key (600 perms, never committed) |
| `~/.config/direnv/direnv.toml` | Global direnv settings (`hide_env_diff`) |
| `docs/secrets.md` | User-facing secrets documentation |
| `docs/discussions/secrets.md` | Architecture decision record for SOPS+age |
| `bin/install` | Installs age, sops, gh, direnv via Homebrew |

## Commit Attribution

Changes to `.envrc`, secrets, and environment config are `tech:` commits — see `docs/conventions/commits.md` for attribution rules.

## Diagnostic Checklist

If direnv produces unexpected output on `cd`:
1. **Run `direnv export zsh > /tmp/out 2> /tmp/err`** — check if `declare -x` lines appear in stderr (they should only be in stdout as valid export commands)
2. **Check sops decrypt output** — run `sops decrypt --output-type dotenv secrets.enc.env` and verify no lines could become bare `export` after sed
3. **Check `direnv status`** — verify the `.envrc` is allowed and watches are correct
4. **Check `direnv.toml`** — confirm `hide_env_diff = true` is set at `~/.config/direnv/direnv.toml`
