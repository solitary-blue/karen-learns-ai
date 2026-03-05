import 'server-only';
import fs from 'fs';
import path from 'path';

/**
 * Returns the absolute path to the project root (where app-config.yml lives).
 * This is intended for server-side use only.
 */
export function getProjectRoot(): string {
  // Try to find the directory containing app-config.yml by searching upwards
  // starting from the directory of the current file.
  let currentDir = __dirname;
  
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'app-config.yml'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback to process.cwd() if app-config.yml is there
  if (fs.existsSync(path.join(process.cwd(), 'app-config.yml'))) {
    return process.cwd();
  }

  // Fallback for monorepo root
  const kittensDir = path.join(process.cwd(), '.apps', 'kittens');
  if (fs.existsSync(path.join(kittensDir, 'app-config.yml'))) {
    return kittensDir;
  }

  return process.cwd();
}
