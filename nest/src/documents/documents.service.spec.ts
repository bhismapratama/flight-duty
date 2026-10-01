import { DataService } from '@infra';

import { DocumentsService, toExpiryStatus } from './documents.service.js';

describe('toExpiryStatus', () => {
  it.each([
    [-1, 'expired'],
    [0, 'expired'],
    [1, 'soon'],
    [30, 'soon'],
    [31, 'safe'],
  ] as const)('%i days remaining is %s', (days, status) => {
    expect(toExpiryStatus(days, 30)).toBe(status);
  });
});

describe('DocumentsService', () => {
  const service = new DocumentsService(new DataService(), {
    port: 4000,
    host: '0.0.0.0',
    baseUrl: 'http://localhost:4000',
    today: '2026-05-15',
    corsOrigins: true,
  });

  it('uses the configured today, sorted most urgent first', () => {
    const { today, items } = service.getDocuments();

    expect(today).toBe('2026-05-15');
    expect(items.map(item => [item.id, item.daysRemaining, item.status])).toEqual([
      ['doc_security', -14, 'expired'],
      ['doc_license', 14, 'soon'],
      ['doc_medical', 27, 'soon'],
      ['doc_recurrent', 152, 'safe'],
      ['doc_ppc', 224, 'safe'],
    ]);
  });
});
