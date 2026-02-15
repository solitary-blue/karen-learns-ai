# Discussion: Secrets Management for Karen's Project

We need a way to store secrets (API keys, GitHub tokens, etc.) that is secure, portable, and allows for "single-password access" when cloning the repo to a new machine.

## Comparison of Recommendations

### 1. SOPS (Secrets OPerationS) + age
**The GitOps Standard**
- **Pros:**
    - **Key Visibility:** Encrypts only the *values* in a file (YAML, JSON, .env), leaving keys visible. This helps Karen see what secrets are required.
    - **Portability:** The encrypted file is checked into Git.
    - **Tooling:** Excellent integration with `direnv` and shell environments.
    - **Security:** Uses `age`, a modern and simple encryption tool (replaces GPG).
- **Cons:**
    - Requires installing two CLI binaries (`sops` and `age`).
    - Slight learning curve for the initial setup of `.sops.yaml`.

### 2. git-crypt
**The "Set it and Forget it" Option**
- **Pros:**
    - **Transparent:** Files look like plain text locally but are automatically encrypted when pushed to Git.
    - **Simplicity:** Once configured via `.gitattributes`, it stays out of the way.
- **Cons:**
    - **Leaky:** If you forget to add a file to `.gitattributes` before committing, the secret is leaked in plain text.
    - **Visibility:** No "partial" encryption; it's all or nothing for a file.
    - **Legacy:** Relies on GPG (though symmetric keys are supported), which can be finicky.

### 3. 1Password CLI (Secret References)
**The User-Friendly Choice**
- **Pros:**
    - **Karen-Friendly:** If Karen already uses 1Password, this is very intuitive.
    - **Zero Blobs:** No encrypted data in the repo. You check in "references" like `op://vault/item/password`.
    - **Seamless:** `direnv` can fetch these values on the fly.
- **Cons:**
    - **Dependency:** Requires a 1Password subscription and the CLI installed/logged in.
    - **Not Self-Contained:** The repo alone isn't enough; you need access to the 1Password vault.

---

## Proposed Implementation: SOPS + age

This approach balances high security with the "checked into GitHub" requirement.

1.  **Generate a Master Key:** We create a master `age` key.
2.  **Key Storage:** This master key is stored in Karen's primary password manager.
3.  **Encrypted Environment:**
    - We create `secrets.enc.env`.
    - We use SOPS to encrypt the values.
    - We check `secrets.enc.env` into the repository.
4.  **Automatic Decryption:**
    - We update `.envrc` to decrypt the file into the environment if the master key is present on the machine.

**Decision:** Which approach aligns best with how you want to manage Karen's access?
