import { describe, it, expect } from 'vitest';

describe('font-weights', () => {
  describe('getWeightName', () => {
    it('returns semantic name for weight value', async () => {
      const { getWeightName } = await import('./font-weights');
      
      expect(getWeightName(100)).toBe('Thin');
      expect(getWeightName(200)).toBe('Extra Light');
      expect(getWeightName(300)).toBe('Light');
      expect(getWeightName(400)).toBe('Regular');
      expect(getWeightName(500)).toBe('Medium');
      expect(getWeightName(600)).toBe('Semi Bold');
      expect(getWeightName(700)).toBe('Bold');
      expect(getWeightName(800)).toBe('Extra Bold');
      expect(getWeightName(900)).toBe('Black');
    });

    it('handles unknown weight values', async () => {
      const { getWeightName } = await import('./font-weights');
      
      expect(getWeightName(150)).toBe('150');
      expect(getWeightName(250)).toBe('250');
    });
  });

  describe('findClosestWeight', () => {
    it('finds exact match when available', async () => {
      const { findClosestWeight } = await import('./font-weights');
      
      const available = [100, 300, 400, 700];
      expect(findClosestWeight(400, available)).toBe(400);
      expect(findClosestWeight(100, available)).toBe(100);
    });

    it('chooses closest weight when exact not available', async () => {
      const { findClosestWeight } = await import('./font-weights');
      
      const available = [100, 400, 700];
      expect(findClosestWeight(300, available)).toBe(400); // Closer to 400 than 100
      expect(findClosestWeight(500, available)).toBe(400); // Closer to 400 than 700
      expect(findClosestWeight(600, available)).toBe(700); // Closer to 700 than 400
    });

    it('chooses lighter weight when tied', async () => {
      const { findClosestWeight } = await import('./font-weights');
      
      const available = [300, 500];
      expect(findClosestWeight(400, available)).toBe(300); // Tie, choose lighter
      
      const available2 = [200, 600];
      expect(findClosestWeight(400, available2)).toBe(200); // Tie, choose lighter
    });

    it('handles edge cases', async () => {
      const { findClosestWeight } = await import('./font-weights');
      
      const available = [400];
      expect(findClosestWeight(100, available)).toBe(400);
      expect(findClosestWeight(900, available)).toBe(400);
    });

    it('works with real font examples', async () => {
      const { findClosestWeight } = await import('./font-weights');
      
      // Space Grotesk: 300, 400, 500, 600, 700
      const spaceGrotesk = [300, 400, 500, 600, 700];
      expect(findClosestWeight(100, spaceGrotesk)).toBe(300);
      expect(findClosestWeight(200, spaceGrotesk)).toBe(300);
      expect(findClosestWeight(800, spaceGrotesk)).toBe(700);
      
      // DM Serif Display: only 400
      const dmSerif = [400];
      expect(findClosestWeight(300, dmSerif)).toBe(400);
      expect(findClosestWeight(700, dmSerif)).toBe(400);
    });
  });

  describe('getAvailableWeights', () => {
    it('returns weights for Google Fonts', async () => {
      const { getAvailableWeights } = await import('./font-weights');
      
      // Inter has full range
      const interWeights = getAvailableWeights('Inter');
      expect(interWeights).toContain(100);
      expect(interWeights).toContain(400);
      expect(interWeights).toContain(900);
      
      // DM Serif Display only has 400
      const dmSerifWeights = getAvailableWeights('DM Serif Display');
      expect(dmSerifWeights).toEqual([400]);
      
      // Space Grotesk has limited range
      const spaceGroteskWeights = getAvailableWeights('Space Grotesk');
      expect(spaceGroteskWeights).toEqual([300, 400, 500, 600, 700]);
    });

    it('returns weights for local fonts from config', async () => {
      const { getAvailableWeights } = await import('./font-weights');
      
      // Bliss has custom weights
      const blissWeights = getAvailableWeights('Bliss');
      expect(blissWeights).toContain(400);
      expect(blissWeights).toContain(700);
      expect(blissWeights).toContain(900);
    });

    it('returns default weight for unknown fonts', async () => {
      const { getAvailableWeights } = await import('./font-weights');
      
      const unknownWeights = getAvailableWeights('UnknownFont');
      expect(unknownWeights).toEqual([400]);
    });
  });

  describe('formatWeightLabel', () => {
    it('formats weight with semantic name', async () => {
      const { formatWeightLabel } = await import('./font-weights');
      
      expect(formatWeightLabel(100)).toBe('Thin 100');
      expect(formatWeightLabel(400)).toBe('Regular 400');
      expect(formatWeightLabel(700)).toBe('Bold 700');
      expect(formatWeightLabel(900)).toBe('Black 900');
    });

    it('handles unknown weights', async () => {
      const { formatWeightLabel } = await import('./font-weights');
      
      expect(formatWeightLabel(150)).toBe('150');
    });
  });
});
