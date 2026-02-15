# Secrets Management with SOPS & age

This project uses **SOPS** and **age** to securely store secrets (API keys, tokens) directly in the Git repository.

## Setup
1. **Master Key**: Your master private key must reside at `~/.config/sops/age/keys.txt`.
2. **Public Key**: The project public key is configured in `.sops.yaml`.

## Usage

### Editing Secrets
To add or change a secret, run:
```bash
sops secrets.enc.env
```
This opens the decrypted file in your default editor (e.g., vim). When you save and exit, SOPS automatically re-encrypts the file.

### Adding New Secrets
Simply add a new key-value pair to the file:
```bash
# Inside sops editor
OPENAI_API_KEY=sk-xxxx...
```

### Manual Encryption/Decryption
If you ever need to view the secrets without exporting them:
```bash
sops decrypt secrets.enc.env
```

## How it works with direnv
The `.envrc` file is configured to automatically decrypt `secrets.enc.env` and export the variables whenever you enter this directory, provided your master key is present.
