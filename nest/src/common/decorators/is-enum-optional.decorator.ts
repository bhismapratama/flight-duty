import { applyDecorators } from '@nestjs/common';
import { IsIn, IsOptional } from 'class-validator';

export function IsEnumOptional(values: readonly string[]) {
  return applyDecorators(
    IsOptional(),
    IsIn(values, { message: `$property must be one of: ${values.join(', ')}` }),
  );
}
