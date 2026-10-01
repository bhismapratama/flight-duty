import { IsEnumOptional } from '@common';
import type { SummaryRange } from '@infra';

import { SUMMARY_RANGES } from '../interface/index.js';

export class GetSummaryDto {
  @IsEnumOptional(SUMMARY_RANGES)
  range: SummaryRange = '1w';
}
