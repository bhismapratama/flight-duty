import { IsIsoDateDefined } from '@common';

export class GetFlightHoursDto {
  @IsIsoDateDefined()
  from: string;

  @IsIsoDateDefined()
  to: string;
}
