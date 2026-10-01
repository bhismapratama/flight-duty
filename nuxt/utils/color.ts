const LIGHT_TEXT = '#FFFFFF';
const DARK_TEXT = '#0E2138';

function channel(value: number): number {
  const ratio = value / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number | null {
  const match = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!match) {
    return null;
  }
  const value = Number.parseInt(match[1]!, 16);
  const r = channel((value >> 16) & 255);
  const g = channel((value >> 8) & 255);
  const b = channel(value & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: number, b: number): number {
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

export function readableTextOn(background: string): string {
  const base = luminance(background);
  if (base === null) {
    return DARK_TEXT;
  }
  const onLight = contrast(base, luminance(LIGHT_TEXT)!);
  const onDark = contrast(base, luminance(DARK_TEXT)!);
  return onLight >= onDark ? LIGHT_TEXT : DARK_TEXT;
}
