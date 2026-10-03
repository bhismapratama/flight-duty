import type { HeaderSlide } from './header-slides';

export interface LoginSlide extends HeaderSlide {
  title: string;
  text: string;
}

export const LOGIN_SLIDE_INTERVAL = 5000;

export const LOGIN_SLIDES: LoginSlide[] = [
  {
    src: '/images/hero-let-410.webp',
    position: '45% 45%',
    desktopPosition: '30% 50%',
    title: 'Your roster at a glance',
    text: 'Duty, leave and training days for the month, colour-coded by duty type.',
  },
  {
    src: '/images/login-cargo.webp',
    position: '22% 40%',
    desktopPosition: '24% 50%',
    title: 'Know your limits before you fly',
    text: 'Daily, weekly, monthly and annual hours against your flight time limits.',
  },
  {
    src: '/images/login-caravan.webp',
    position: '50% 55%',
    desktopPosition: '50% 55%',
    title: 'Stay current',
    text: 'Licence, medical and recurrent checks flagged before they expire.',
  },
];
