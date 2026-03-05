import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');
vi.mock('./server-utils', () => ({
  getProjectRoot: () => '/mock/cwd',
}));
vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>();
  return {
    ...actual,
    default: {
      ...actual,
      join: (...args: string[]) => args.join('/'),
    }
  };
});

describe('kitten-config', () => {
  let kittenConfig: typeof import('./kitten-config');

  beforeEach(async () => {
    vi.resetModules();
    kittenConfig = await import('./kitten-config');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadAppConfig', () => {
    it('returns defaults when no file exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      const config = kittenConfig.loadAppConfig();
      expect(config).toEqual({
        'kitten-size': '280px',
        'callout-kitten-size': '180px',
        'kitten-min-other-lines': 3,
      });
    });

    it('merges file over defaults', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('kitten-size: 300px\n');
      
      const config = kittenConfig.loadAppConfig();
      expect(config).toEqual({
        'kitten-size': '300px',
        'callout-kitten-size': '180px',
        'kitten-min-other-lines': 3,
      });
    });

    it('caches after first load', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('kitten-size: 300px\n');
      
      kittenConfig.loadAppConfig();
      kittenConfig.loadAppConfig();
      
      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('discoverKittens', () => {
    it('returns empty array when dir missing', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      const kittens = kittenConfig.discoverKittens();
      expect(kittens).toEqual([]);
    });

    it('strips kitty- prefix and ignores non-PNG', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'kitty-suit-arms-crossed.png',
        'kitty-proud-book.png',
        'not-a-kitten.png',
        'kitty-invalid.jpg'
      ] as any);
      
      const kittens = kittenConfig.discoverKittens();
      expect(kittens).toEqual([
        { name: 'suit-arms-crossed', filePath: '/mock/cwd/assets/kittens/kitty-suit-arms-crossed.png' },
        { name: 'proud-book', filePath: '/mock/cwd/assets/kittens/kitty-proud-book.png' }
      ]);
    });

    it('caches discovered kittens', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      
      kittenConfig.discoverKittens();
      kittenConfig.discoverKittens();
      
      expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('resolveKitten', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['kitty-test-cat.png'] as any);
    });

    it('returns valid info for known name', () => {
      const kitten = kittenConfig.resolveKitten('test-cat');
      expect(kitten).toEqual({ name: 'test-cat', filePath: '/mock/cwd/assets/kittens/kitty-test-cat.png' });
    });

    it('returns null for unknown name', () => {
      const kitten = kittenConfig.resolveKitten('unknown-cat');
      expect(kitten).toBeNull();
    });
  });

  describe('pickKittenFromPreferences', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'kitty-cat1.png',
        'kitty-cat2.png'
      ] as any);
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('picks first valid from array', () => {
      const kitten = kittenConfig.pickKittenFromPreferences(['invalid-cat', 'cat2', 'cat1']);
      expect(kitten).toEqual({ name: 'cat2', filePath: '/mock/cwd/assets/kittens/kitty-cat2.png' });
      expect(console.warn).toHaveBeenCalledWith("Warning: Preferred kitten 'invalid-cat' not found.");
    });

    it('handles single string', () => {
      const kitten = kittenConfig.pickKittenFromPreferences('cat1');
      expect(kitten).toEqual({ name: 'cat1', filePath: '/mock/cwd/assets/kittens/kitty-cat1.png' });
    });

    it('returns null when all invalid', () => {
      const kitten = kittenConfig.pickKittenFromPreferences(['invalid1', 'invalid2']);
      expect(kitten).toBeNull();
      expect(console.warn).toHaveBeenCalledTimes(2);
    });
  });
});
