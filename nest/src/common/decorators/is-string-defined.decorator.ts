import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export function IsStringDefined(maxLength = 255, { trim = true }: { trim?: boolean } = {}) {
  const validators = [
    IsDefined({ message: '$property is required' }),
    IsString(),
    IsNotEmpty({ message: '$property should not be empty' }),
    MaxLength(maxLength),
  ];

  if (!trim) {
    return applyDecorators(...validators);
  }

  return applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    ...validators,
  );
}
