import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { appConfig } from '@common';
import { DataService } from '@infra';
import { diffInDays } from '@utils';

import type { DocumentList, ExpiryStatus } from './interface/index.js';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly data: DataService,
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
  ) {}

  getDocuments(): DocumentList {
    const { today } = this.app;
    const { thresholds, documents } = this.data.documents;

    const items = documents
      .map(document => {
        const daysRemaining = diffInDays(today, document.expiryDate);

        return {
          id: document.id,
          label: document.label,
          expiryDate: document.expiryDate,
          daysRemaining,
          status: toExpiryStatus(daysRemaining, thresholds.warningDays),
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return { today, warningDays: thresholds.warningDays, items };
  }
}

export function toExpiryStatus(daysRemaining: number, warningDays: number): ExpiryStatus {
  if (daysRemaining <= 0) {
    return 'expired';
  }

  return daysRemaining <= warningDays ? 'soon' : 'safe';
}
