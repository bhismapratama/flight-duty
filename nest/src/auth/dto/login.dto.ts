import { IsStringDefined } from '@common';

export class LoginDto {
  @IsStringDefined(64)
  username: string;

  @IsStringDefined(128, { trim: false })
  password: string;
}
