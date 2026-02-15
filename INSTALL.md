# Installation Guide

This document lists the tools and setup required to work on this project.

## Core Prerequisites
- **Homebrew**: The package manager for macOS.
- **Git**: For version control.
- **direnv**: To manage environment variables automatically.

## Project Tools
These tools are used for secret management and AI interaction:
- **age**: A simple, modern encryption tool.
- **sops**: For managing encrypted secrets in Git.
- **gh**: GitHub CLI for account and repository management.
- **gemini-cli**: The interface for interacting with Gemini agents.

## Automated Setup
You can run the installation script to ensure all dependencies are present:

```bash
./bin/install
```

## Manual Configuration
1. **Secrets**: Ensure your `age` master key is present in `~/.config/sops/age/keys.txt`. See [Secrets Documentation](docs/secrets.md) for usage.
2. **Environment**: Run `direnv allow` in the project root.
