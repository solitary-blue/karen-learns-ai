import 'server-only';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getProjectRoot } from './server-utils';
import type { CurriculumRoot, CurriculumRootsConfig } from './types';

let cachedConfig: CurriculumRootsConfig | null = null;

function getDefaultConfig(): CurriculumRootsConfig {
  return {
    'curriculum-root-default': 'current',
    'curriculum-roots': [
      {
        id: 'current',
        label: 'Curriculum',
        'path-segments': [''],
        'enclosing-dir': 'karen-learns-ai',
      },
    ],
  };
}

export function loadCurriculumRootsConfig(): CurriculumRootsConfig {
  if (cachedConfig) return cachedConfig;

  const defaults = getDefaultConfig();

  try {
    const configPath = path.join(getProjectRoot(), 'app-config.yml');
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const data = yaml.load(fileContents) as Partial<CurriculumRootsConfig>;

      if (data['curriculum-roots'] && Array.isArray(data['curriculum-roots'])) {
        cachedConfig = {
          'curriculum-root-default': data['curriculum-root-default'] || defaults['curriculum-root-default'],
          'curriculum-roots': data['curriculum-roots'],
        };
        return cachedConfig;
      }
    }
  } catch (e) {
    console.error('Failed to load curriculum roots config:', e);
  }

  cachedConfig = defaults;
  return cachedConfig;
}

export function getDefaultRootId(): string {
  const config = loadCurriculumRootsConfig();
  return config['curriculum-root-default'] || config['curriculum-roots'][0]?.id || 'current';
}

export function getRootById(rootId: string): CurriculumRoot | null {
  const config = loadCurriculumRootsConfig();
  return config['curriculum-roots'].find(r => r.id === rootId) || null;
}

export function resolveRootFromPath(pathSegment: string): CurriculumRoot | null {
  const config = loadCurriculumRootsConfig();
  const normalizedSegment = pathSegment.replace(/^\//, '');

  if (!normalizedSegment) {
    const defaultId = config['curriculum-root-default'] || config['curriculum-roots'][0]?.id;
    return config['curriculum-roots'].find(r => r.id === defaultId) || null;
  }

  for (const root of config['curriculum-roots']) {
    if (root['path-segments'].includes(normalizedSegment)) {
      return root;
    }
  }

  return null;
}

export function getCurriculumDir(rootId: string): string {
  const root = getRootById(rootId);
  if (!root) {
    throw new Error(`Unknown curriculum root id: ${rootId}`);
  }

  const projectRoot = getProjectRoot();
  const parentDir = path.dirname(path.dirname(path.dirname(projectRoot)));
  const curriculumDir = path.join(parentDir, root['enclosing-dir'], 'curriculum');

  return curriculumDir;
}

export function validateCurriculumDir(rootId: string): boolean {
  try {
    const dir = getCurriculumDir(rootId);
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

export interface ClientCurriculumRoot {
  id: string;
  label: string;
  pathSegments: string[];
}

export function getCurriculumRootsForClient(): ClientCurriculumRoot[] {
  const config = loadCurriculumRootsConfig();
  return config['curriculum-roots'].map(root => ({
    id: root.id,
    label: root.label,
    pathSegments: root['path-segments'],
  }));
}

export function getPrimaryPathSegment(rootId: string): string {
  const root = getRootById(rootId);
  if (!root) return '';

  const nonEmptySegments = root['path-segments'].filter(s => s !== '');
  return nonEmptySegments[0] || '';
}
