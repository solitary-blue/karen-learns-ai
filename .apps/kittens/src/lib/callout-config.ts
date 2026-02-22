import 'server-only';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface CalloutConfig {
  type: string;
  title?: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  aliases?: string[];
}

export interface CalloutsConfig {
  callouts: Record<string, CalloutConfig>;
}

let cachedConfig: CalloutsConfig | null = null;

export function loadCalloutConfig(): CalloutsConfig {
  if (cachedConfig) return cachedConfig;

  try {
    const configPath = path.join(process.cwd(), 'callouts-config.yml');
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const data = yaml.load(fileContents) as any;

      if (data && data.callouts) {
        let callouts: Record<string, CalloutConfig>;

        if (Array.isArray(data.callouts)) {
          // YAML has an array of callout objects — transform to record keyed by type
          callouts = {};
          for (const entry of data.callouts) {
            callouts[entry.type] = entry;
            // Register aliases so e.g. "important" resolves to "tip"
            if (entry.aliases) {
              for (const alias of entry.aliases) {
                callouts[alias] = entry;
              }
            }
          }
        } else {
          callouts = data.callouts;
        }

        cachedConfig = { callouts };
        return cachedConfig;
      }
    }
  } catch (e) {
    console.error('Failed to load callouts config:', e);
  }

  return { callouts: {} };
}
