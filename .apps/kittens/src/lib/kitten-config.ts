import 'server-only';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getProjectRoot } from './server-utils';

export interface AppConfig {
  'kitten-size': string;
  'callout-kitten-size': string;
  'kitten-min-other-lines': number;
}

export interface KittenInfo {
  name: string;
  filePath: string;
}

let cachedAppConfig: AppConfig | null = null;
let cachedKittens: KittenInfo[] | null = null;

export function loadAppConfig(): AppConfig {
  if (cachedAppConfig) return cachedAppConfig;

  const defaults: AppConfig = {
    'kitten-size': '280px',
    'callout-kitten-size': '180px',
    'kitten-min-other-lines': 3,
  };

  try {
    const configPath = path.join(getProjectRoot(), 'app-config.yml');
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const data = yaml.load(fileContents) as Partial<AppConfig>;
      
      cachedAppConfig = { ...defaults, ...data };
      return cachedAppConfig;
    }
  } catch (e) {
    console.error('Failed to load app config:', e);
  }

  cachedAppConfig = defaults;
  return cachedAppConfig;
}

export function discoverKittens(): KittenInfo[] {
  if (cachedKittens) return cachedKittens;

  cachedKittens = [];
  try {
    const kittensDir = path.join(getProjectRoot(), 'assets', 'kittens');
    if (fs.existsSync(kittensDir)) {
      const files = fs.readdirSync(kittensDir);
      for (const file of files) {
        if (!file.endsWith('.png') || !file.startsWith('kitty-')) continue;
        const name = file.replace(/^kitty-/, '').replace(/\.png$/, '');
        cachedKittens.push({
          name,
          filePath: path.join(kittensDir, file),
        });
      }
    }
  } catch (e) {
    console.error('Failed to discover kittens:', e);
  }

  return cachedKittens;
}

export function resolveKitten(name: string): KittenInfo | null {
  const kittens = discoverKittens();
  return kittens.find(k => k.name === name) || null;
}

export function pickRandomKitten(): KittenInfo | null {
  const kittens = discoverKittens();
  if (kittens.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * kittens.length);
  return kittens[randomIndex];
}

export function pickKittenFromPreferences(prefs: string | string[]): KittenInfo | null {
  const prefsArray = Array.isArray(prefs) ? prefs : [prefs];
  
  for (const pref of prefsArray) {
    const kitten = resolveKitten(pref);
    if (kitten) {
      return kitten;
    }
    console.warn(`Warning: Preferred kitten '${pref}' not found.`);
  }
  
  return null;
}
