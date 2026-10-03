export interface HeaderSlide {
  src: string;
  position: string;
  desktopPosition: string;
}

export const HEADER_SLIDE_INTERVAL = 7000;

export const HEADER_SLIDES: HeaderSlide[] = [
  { src: '/images/cover-avanti-ii.webp', position: '88% 50%', desktopPosition: '50% 30%' },
  { src: '/images/cover-avanti-reef.webp', position: '50% 50%', desktopPosition: '50% 45%' },
  { src: '/images/cover-fleet.webp', position: '50% 50%', desktopPosition: '50% 40%' },
  { src: '/images/cover-porter-sunset.webp', position: '50% 50%', desktopPosition: '50% 60%' },
  { src: '/images/cover-avanti-mountain.webp', position: '45% 50%', desktopPosition: '50% 50%' },
];
