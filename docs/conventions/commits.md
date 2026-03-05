# Commit Conventions

To make the project history readable and meaningful for Karen, we use the following commit types.

## Types

| Type | Description | For Karen? | Emoji |
| :--- | :--- | :--- | :--- |
| **`tech`** | Updates to tools, config, infrastructure. | 🙈 (Ignore) | 🙈 |
| **`ai`** | AI skills, prompts, persona instructions. | 🧠 (Core learning) | 🧠 |
| **`research`** | Documents, paper summaries, data. | 📖 (Read this) | 📖 |
| **`write`** | Drafting Master's content or school papers. | ✍️ (Drafting) | ✍️ |
| **`edit`** | Polishing or revising existing work. | 💅 (Refining) | 💅 |
| **`learn`** | Karen's personal learning logs/reflections. | 📓 (Journal) | 📓 |
| **`review`** | Feedback and critiques. | 💬 (Feedback) | 💬 |
| **`media`** | Images, PDFs, or diagrams. | 🎨 (Visuals) | 🎨 |
| **`design`**| UX/UI, mockups, themes, aesthetics. | 🖌️ (Creative) | 🖌️ |
| **`organize`**| Moving files, folder structures. | 📂 (FYI) | 📂 |
| **`todo`** | Task management (updating `TODO.md`). | ✅ (Actionable) | ✅ |
| **`docs`** | How-to guides, project documentation. | 📝 (Read this) | 📝 |

## Format
Use the format: `type: [EMOJI] brief description`

*Example:* `ai: 🧠 update the Montessori Guide persona`
*Example:* `tech: 🙈 update sops configuration`

## Attribution

The `.envrc` sets `GIT_AUTHOR_NAME` to Karen Ngo by default. Override this for **`tech:` commits** (infrastructure, tooling, config) — these are the GUIDE's work, not Karen's:

```bash
git commit --author="Michael Johnston <lastobelus@mac.com>" -m "tech: 🙈 description"
```

Use Karen's default attribution for learning-related commits (`docs:`, `learn:`, `write:`, `exercise:`, etc.).

---

# Git Client for Karen

We recommend **SourceTree**. It clearly shows the history of these emojis, making it easy for Karen to spot her **`✍️` Writing** or your **`💬` Feedback**.
