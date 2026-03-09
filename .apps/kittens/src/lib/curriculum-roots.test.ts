import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');
vi.mock('./server-utils', () => ({
  getProjectRoot: () => '/Users/lasto/clients/lastobelus-2025/karen-learns-ai/.apps/kittens',
}));

describe('curriculum-roots', () => {
  let curriculumRoots: typeof import('./curriculum-roots');

  beforeEach(async () => {
    vi.resetModules();
    curriculumRoots = await import('./curriculum-roots');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadCurriculumRootsConfig', () => {
    it('returns defaults when no curriculum-roots section exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('kitten-size: 400px\n');
      
      const config = curriculumRoots.loadCurriculumRootsConfig();
      expect(config['curriculum-root-default']).toBe('current');
      expect(config['curriculum-roots']).toHaveLength(1);
      expect(config['curriculum-roots'][0].id).toBe('current');
    });

    it('parses configured curriculum roots from yaml', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
kitten-size: 400px
curriculum-root-default: workspace
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
`);
      
      const config = curriculumRoots.loadCurriculumRootsConfig();
      expect(config['curriculum-root-default']).toBe('workspace');
      expect(config['curriculum-roots']).toHaveLength(2);
      expect(config['curriculum-roots'][0].id).toBe('current');
      expect(config['curriculum-roots'][1].id).toBe('workspace');
    });
  });

  describe('resolveRootFromPath', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
`);
    });

    it('resolves default root for empty path', () => {
      const root = curriculumRoots.resolveRootFromPath('');
      expect(root?.id).toBe('current');
    });

    it('resolves default root for / path', () => {
      const root = curriculumRoots.resolveRootFromPath('/');
      expect(root?.id).toBe('current');
    });

    it('resolves root by primary path segment', () => {
      const root = curriculumRoots.resolveRootFromPath('workspace');
      expect(root?.id).toBe('workspace');
    });

    it('resolves root by aliased path segment', () => {
      const root = curriculumRoots.resolveRootFromPath('work');
      expect(root?.id).toBe('workspace');
    });

    it('resolves root with leading slash', () => {
      const root = curriculumRoots.resolveRootFromPath('/workspace');
      expect(root?.id).toBe('workspace');
    });

    it('returns null for unknown root path segment', () => {
      const root = curriculumRoots.resolveRootFromPath('unknown-root');
      expect(root).toBeNull();
    });
  });

  describe('getCurriculumDir', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
`);
    });

    it('computes curriculum dir relative to parent of repo root', () => {
      const dir = curriculumRoots.getCurriculumDir('current');
      expect(dir).toBe('/Users/lasto/clients/lastobelus-2025/karen-learns-ai/curriculum');
    });

    it('prefers an in-repo workspace curriculum when it exists', () => {
      const dir = curriculumRoots.getCurriculumDir('workspace');
      expect(dir).toBe('/Users/lasto/clients/lastobelus-2025/karen-learns-ai/workspace/curriculum');
    });

    it('falls back to a sibling workspace curriculum when the in-repo one is missing', () => {
      vi.mocked(fs.existsSync).mockImplementation((candidate) => {
        const filePath = String(candidate);
        if (filePath.endsWith('app-config.yml')) {
          return true;
        }

        if (filePath === '/Users/lasto/clients/lastobelus-2025/karen-learns-ai/workspace/curriculum') {
          return false;
        }

        if (filePath === '/Users/lasto/clients/lastobelus-2025/workspace/curriculum') {
          return true;
        }

        return true;
      });

      const dir = curriculumRoots.getCurriculumDir('workspace');
      expect(dir).toBe('/Users/lasto/clients/lastobelus-2025/workspace/curriculum');
    });

    it('throws for unknown root id', () => {
      expect(() => curriculumRoots.getCurriculumDir('unknown')).toThrow();
    });
  });

  describe('getCurriculumRootsForClient', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
`);
    });

    it('returns client-safe root metadata', () => {
      const roots = curriculumRoots.getCurriculumRootsForClient();
      expect(roots).toHaveLength(2);
      expect(roots[0]).toEqual({
        id: 'current',
        label: 'Karen Learns AI',
        pathSegments: ['', 'karen-learns-ai'],
      });
      expect(roots[1]).toEqual({
        id: 'workspace',
        label: 'Workspace',
        pathSegments: ['workspace', 'work'],
      });
    });
  });

  describe('getDefaultRootId', () => {
    it('returns configured default root id', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: workspace
curriculum-roots:
  - id: current
    label: Current
    path-segments: ['']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace']
    enclosing-dir: workspace
`);
      
      const defaultId = curriculumRoots.getDefaultRootId();
      expect(defaultId).toBe('workspace');
    });

    it('returns first root if default not specified', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-roots:
  - id: current
    label: Current
    path-segments: ['']
    enclosing-dir: karen-learns-ai
`);
      
      const defaultId = curriculumRoots.getDefaultRootId();
      expect(defaultId).toBe('current');
    });
  });

  describe('getRootById', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
`);
    });

    it('returns root by id', () => {
      const root = curriculumRoots.getRootById('workspace');
      expect(root?.id).toBe('workspace');
      expect(root?.label).toBe('Workspace');
    });

    it('returns null for unknown id', () => {
      const root = curriculumRoots.getRootById('unknown');
      expect(root).toBeNull();
    });
  });

  describe('validateCurriculumDir', () => {
    it('returns true for valid curriculum dir', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Current
    path-segments: ['']
    enclosing-dir: karen-learns-ai
`);
      vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);
      
      const valid = curriculumRoots.validateCurriculumDir('current');
      expect(valid).toBe(true);
    });

    it('returns false for non-existent dir', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Current
    path-segments: ['']
    enclosing-dir: karen-learns-ai
`);
      vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => false } as any);
      
      const valid = curriculumRoots.validateCurriculumDir('current');
      expect(valid).toBe(false);
    });
  });
});
