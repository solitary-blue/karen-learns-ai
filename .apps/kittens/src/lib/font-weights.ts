import { WEIGHT_NAMES, GOOGLE_FONT_WEIGHTS } from './font-weights-data';

export function getWeightName(weight: number): string {
  return WEIGHT_NAMES[weight] || String(weight);
}

export function formatWeightLabel(weight: number): string {
  const name = WEIGHT_NAMES[weight];
  return name ? `${name} ${weight}` : String(weight);
}

export function findClosestWeight(target: number, available: number[]): number {
  if (available.length === 0) return 400;
  if (available.length === 1) return available[0];
  
  if (available.includes(target)) return target;
  
  const sorted = [...available].sort((a, b) => a - b);
  
  let closest = sorted[0];
  let minDiff = Math.abs(target - closest);
  
  for (const weight of sorted) {
    const diff = Math.abs(target - weight);
    if (diff < minDiff || (diff === minDiff && weight < closest)) {
      closest = weight;
      minDiff = diff;
    }
  }
  
  return closest;
}

export function getAvailableWeights(fontName: string): number[] {
  if (fontName in GOOGLE_FONT_WEIGHTS) {
    return GOOGLE_FONT_WEIGHTS[fontName];
  }
  
  return [400];
}

export function hasMultipleWeights(fontName: string): boolean {
  return getAvailableWeights(fontName).length > 1;
}
