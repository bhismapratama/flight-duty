import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Max, Min } from 'class-validator';

export function IsIntDefined(min: number, max: number) {
  const outOfRange = `$property must be between ${min} and ${max}`;

  return applyDecorators(
    IsDefined({ message: '$property is required' }),
    Type(() => Number),
    IsInt({ message: '$property must be an integer' }),
    Min(min, { message: outOfRange }),
    Max(max, { message: outOfRange }),
  );
}
