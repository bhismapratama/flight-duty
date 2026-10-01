import type { SummaryRange } from '~/types/entities/flight-hours';

export interface RangeOption {
  value: SummaryRange;
  label: string;
}

export const DEFAULT_RANGE: SummaryRange = '1w';

export const RANGE_OPTIONS: RangeOption[] = [
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
];
