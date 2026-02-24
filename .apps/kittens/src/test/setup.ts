import { vi } from 'vitest';

// Neutralize the `server-only` package that throws at import time
// outside a Next.js server context. Global setup means no test file
// needs to think about it.
vi.mock('server-only', () => ({}));
