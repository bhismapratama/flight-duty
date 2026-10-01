import { IsIntDefined } from '@common';

export class GetSchedulesDto {
  @IsIntDefined(2000, 2100)
  year: number;

  @IsIntDefined(1, 12)
  month: number;
}
