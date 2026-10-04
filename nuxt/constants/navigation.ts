import { BookOpenText, CalendarDays, CircleEllipsis, House } from '@lucide/vue';
import type { Component } from 'vue';
import { ROUTES } from './routes';

export interface NavigationItem {
  label: string;
  to: string;
  icon: Component;
}

export const BOTTOM_NAVIGATION: NavigationItem[] = [
  { label: 'Home', to: ROUTES.home, icon: House },
  { label: 'Schedule', to: ROUTES.schedule, icon: CalendarDays },
  { label: 'Logbook', to: ROUTES.logbook, icon: BookOpenText },
  { label: 'More', to: ROUTES.more, icon: CircleEllipsis },
];
