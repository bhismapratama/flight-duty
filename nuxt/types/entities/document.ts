export type ExpiryStatus = 'safe' | 'soon' | 'expired';

export interface PilotDocument {
  id: string;
  label: string;
  expiryDate: string;
  daysRemaining: number;
  status: ExpiryStatus;
}

export interface DocumentList {
  today: string;
  warningDays: number;
  items: PilotDocument[];
}
