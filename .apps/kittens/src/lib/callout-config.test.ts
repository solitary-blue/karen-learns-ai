import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'fs';
import yaml from 'js-yaml';

describe('loadCalloutConfig', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function loadFresh() {
    const mod = await import('./callout-config');
    return mod.loadCalloutConfig;
  }

  it('parses array-format YAML with alias registration', async () => {
    const configYaml = yaml.dump({
      callouts: [
        {
          type: 'tip',
          title: 'Tip',
          icon: 'Flame',
          aliases: ['hint', 'important'],
        },
      ],
    });

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(configYaml);

    const loadCalloutConfig = await loadFresh();
    const config = loadCalloutConfig();

    expect(config.callouts['tip']).toMatchObject({ type: 'tip', title: 'Tip' });
    expect(config.callouts['hint']).toBe(config.callouts['tip']);
    expect(config.callouts['important']).toBe(config.callouts['tip']);
  });

  it('returns empty callouts when config file not found', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const loadCalloutConfig = await loadFresh();
    const config = loadCalloutConfig();

    expect(config.callouts).toEqual({});
  });

  it('returns empty callouts on YAML parse error (fail-open)', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('callouts: [broken yaml');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const loadCalloutConfig = await loadFresh();
    const config = loadCalloutConfig();

    expect(config.callouts).toEqual({});
  });

  it('caches config — readFileSync called only once across multiple loads', async () => {
    const configYaml = yaml.dump({
      callouts: [{ type: 'note', title: 'Note', icon: 'FileText' }],
    });

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readSpy = vi.spyOn(fs, 'readFileSync').mockReturnValue(configYaml);

    const loadCalloutConfig = await loadFresh();
    loadCalloutConfig();
    loadCalloutConfig();
    loadCalloutConfig();

    expect(readSpy).toHaveBeenCalledTimes(1);
  });

  it('handles record-format callouts (non-array YAML)', async () => {
    const configYaml = yaml.dump({
      callouts: {
        note: { type: 'note', title: 'Note', icon: 'FileText' },
        tip: { type: 'tip', title: 'Tip', icon: 'Flame' },
      },
    });

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(configYaml);

    const loadCalloutConfig = await loadFresh();
    const config = loadCalloutConfig();

    expect(config.callouts['note']).toMatchObject({ type: 'note' });
    expect(config.callouts['tip']).toMatchObject({ type: 'tip' });
  });
});
