import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ThemeDefinition } from '../src/lib/theme-parser';

const themesDir = path.join(process.cwd(), 'themes');

let totalErrors = 0;

function checkSemantics(obj: any, currentPath: string, colorValuesToNames: Map<string, string>, hardcodedHexCounts: Map<string, string[]>, fileName: string) {
  let errors = 0;
  for (const [key, value] of Object.entries(obj)) {
    const fieldPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (typeof value === 'string') {
      if (value.startsWith('#')) {
        const hexLower = value.toLowerCase();
        
        // Rule 1: Reference Check
        if (colorValuesToNames.has(hexLower)) {
          const colorName = colorValuesToNames.get(hexLower);
          console.error(`  ⚠️  [${fileName}] Reference Check: '${fieldPath}' uses hardcoded '${value}'. You should reference the named color '${colorName}' instead.`);
          errors++;
        } else {
          // Rule 2 track
          const paths = hardcodedHexCounts.get(hexLower) || [];
          paths.push(fieldPath);
          hardcodedHexCounts.set(hexLower, paths);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      errors += checkSemantics(value, fieldPath, colorValuesToNames, hardcodedHexCounts, fileName);
    }
  }
  return errors;
}

function lintTheme(filePath: string, fileName: string) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  let themeDef: ThemeDefinition;
  
  try {
    themeDef = yaml.load(fileContents) as ThemeDefinition;
  } catch (e) {
    console.error(`❌ [${fileName}] Invalid YAML:`, e);
    totalErrors++;
    return;
  }

  if (!themeDef.colors || !themeDef.semantics) {
    console.error(`❌ [${fileName}] Missing required 'colors' or 'semantics' section.`);
    totalErrors++;
    return;
  }

  const colorValuesToNames = new Map<string, string>();
  
  for (const [name, hex] of Object.entries(themeDef.colors)) {
    if (typeof hex === 'string' && hex.startsWith('#')) {
      colorValuesToNames.set(hex.toLowerCase(), name);
    }
  }

  let fileErrors = 0;
  const hardcodedHexCounts = new Map<string, string[]>();

  fileErrors += checkSemantics(themeDef.semantics, 'semantics', colorValuesToNames, hardcodedHexCounts, fileName);

  // Rule 2 check
  for (const [hex, paths] of hardcodedHexCounts.entries()) {
    if (paths.length > 1) {
      console.error(`  ⚠️  [${fileName}] Duplication Check: '${hex}' is hardcoded in multiple places (${paths.join(', ')}). Consider adding it to 'colors' and referencing by name.`);
      fileErrors++;
    }
  }

  if (fileErrors === 0) {
    console.log(`✅ [${fileName}] Passed`);
  } else {
    totalErrors += fileErrors;
  }
}

function runLinter() {
  console.log('🔍 Linting Themes...\n');
  
  if (!fs.existsSync(themesDir)) {
    console.error(`❌ Themes directory not found at ${themesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  if (files.length === 0) {
    console.log('No theme files found.');
    return;
  }

  for (const file of files) {
    lintTheme(path.join(themesDir, file), file);
  }

  console.log('\n----------------------------------------');
  if (totalErrors > 0) {
    console.error(`❌ Found ${totalErrors} issue(s) across theme files.`);
    process.exit(1);
  } else {
    console.log('🎉 All themes passed linting successfully!');
    process.exit(0);
  }
}

runLinter();
