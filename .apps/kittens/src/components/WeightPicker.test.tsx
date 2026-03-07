import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

vi.mock('./font-weights', () => ({
  getAvailableWeights: (fontName: string) => {
    const weights: Record<string, number[]> = {
      'Inter': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'DM Serif Display': [400],
      'Space Grotesk': [300, 400, 500, 600, 700],
    };
    return weights[fontName] || [400];
  },
  formatWeightLabel: (weight: number) => {
    const names: Record<number, string> = {
      100: 'Thin 100',
      200: 'Extra Light 200',
      300: 'Light 300',
      400: 'Regular 400',
      500: 'Medium 500',
      600: 'Semi Bold 600',
      700: 'Bold 700',
      800: 'Extra Bold 800',
      900: 'Black 900',
    };
    return names[weight] || String(weight);
  },
  hasMultipleWeights: (fontName: string) => {
    return fontName !== 'DM Serif Display';
  },
}));

describe('WeightPicker', () => {
  it('renders select with available weights', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    
    render(
      <WeightPicker
        fontName="Inter"
        selectedWeight={400}
        onWeightChange={() => {}}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('400');
    
    fireEvent.click(select);
    expect(screen.getByText('Regular 400')).toBeInTheDocument();
    expect(screen.getByText('Bold 700')).toBeInTheDocument();
  });

  it('shows all available weights for font', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    
    render(
      <WeightPicker
        fontName="Space Grotesk"
        selectedWeight={400}
        onWeightChange={() => {}}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByText('Light 300')).toBeInTheDocument();
    expect(screen.getByText('Regular 400')).toBeInTheDocument();
    expect(screen.getByText('Medium 500')).toBeInTheDocument();
    expect(screen.getByText('Semi Bold 600')).toBeInTheDocument();
    expect(screen.getByText('Bold 700')).toBeInTheDocument();
  });

  it('calls onWeightChange when weight is selected', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    const onWeightChange = vi.fn();
    
    render(
      <WeightPicker
        fontName="Inter"
        selectedWeight={400}
        onWeightChange={onWeightChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '700' } });
    
    expect(onWeightChange).toHaveBeenCalledWith(700);
  });

  it('reserves space when font has only one weight', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    
    const { container } = render(
      <WeightPicker
        fontName="DM Serif Display"
        selectedWeight={400}
        onWeightChange={() => {}}
      />
    );
    
    const spacer = container.querySelector('.weight-picker-spacer');
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveClass('invisible');
  });

  it('does not show spacer when font has multiple weights', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    
    const { container } = render(
      <WeightPicker
        fontName="Inter"
        selectedWeight={400}
        onWeightChange={() => {}}
      />
    );
    
    const spacer = container.querySelector('.weight-picker-spacer');
    expect(spacer).not.toBeInTheDocument();
  });

  it('updates available weights when font changes', async () => {
    const { WeightPicker } = await import('@/components/WeightPicker');
    const onWeightChange = vi.fn();
    
    const { rerender } = render(
      <WeightPicker
        fontName="Inter"
        selectedWeight={400}
        onWeightChange={onWeightChange}
      />
    );
    
    let select = screen.getByRole('combobox');
    expect(select).toHaveValue('400');
    
    rerender(
      <WeightPicker
        fontName="Space Grotesk"
        selectedWeight={400}
        onWeightChange={onWeightChange}
      />
    );
    
    select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByText('Light 300')).toBeInTheDocument();
    expect(screen.queryByText('Thin 100')).not.toBeInTheDocument();
  });
});
