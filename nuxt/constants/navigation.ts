import { BookOpenText, CalendarDays, CircleEllipsis, House } from '@lucide/vue';
import type { Component } from 'vue';

export interface NavigationItem {
  label: string;
  to: string;
  icon: Component;
}

export const BOTTOM_NAVIGATION: NavigationItem[] = [
  { label: 'Home', to: '/home', icon: House },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Logbook', to: '/logbook', icon: BookOpenText },
  { label: 'More', to: '/more', icon: CircleEllipsis },
];
