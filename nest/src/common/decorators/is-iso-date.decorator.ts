import { applyDecorators } from '@nestjs/common';
import { IsDefined, ValidateBy } from 'class-validator';

import { isIsoDate } from '@utils';

export function IsIsoDateDefined() {
  return applyDecorators(
    IsDefined({ message: '$property is required' }),
    ValidateBy({
      name: 'isIsoDate',
      validator: {
        validate: value => isIsoDate(value),
        defaultMessage: args =>
          `${args?.property ?? 'value'} must be a valid date in YYYY-MM-DD format`,
      },
    }),
  );
}
