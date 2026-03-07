'use client';

import * as React from 'react';
import { getAvailableWeights, formatWeightLabel, hasMultipleWeights } from '@/lib/font-weights';

interface WeightPickerProps {
  fontName: string;
  availableWeights?: number[];
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
  className?: string;
}

export function WeightPicker({ fontName, availableWeights, selectedWeight, onWeightChange, className }: WeightPickerProps) {
  const resolvedWeights = availableWeights || getAvailableWeights(fontName);
  const showPicker = availableWeights ? availableWeights.length > 1 : hasMultipleWeights(fontName);
  
  if (!showPicker) {
    return (
      <div className={`weight-picker-spacer invisible ${className || ''}`}>
        <label className="text-sm font-medium text-muted-foreground block">Font Weight</label>
        <div className="w-full h-[42px]" />
      </div>
    );
  }
  
  return (
    <div className={className}>
      <label className="text-sm font-medium text-muted-foreground block">Font Weight</label>
      <select
        className="w-full text-base bg-transparent border border-border rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary p-2 text-foreground mt-2"
        value={selectedWeight}
        onChange={(e) => onWeightChange(parseInt(e.target.value, 10))}
      >
        {resolvedWeights.map(weight => (
          <option key={weight} value={weight}>
            {formatWeightLabel(weight)}
          </option>
        ))}
      </select>
    </div>
  );
}
