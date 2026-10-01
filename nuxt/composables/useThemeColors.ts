export interface ThemeColors {
  navy: string;
  red: string;
  text: string;
  textSecondary: string;
  border: string;
  chart: string;
  danger: string;
  surface: string;
  fontFamily: string;
}

export function useThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();

  return {
    navy: read('--color-navy'),
    red: read('--color-red'),
    text: read('--color-text'),
    textSecondary: read('--color-text-secondary'),
    border: read('--color-border'),
    chart: read('--color-chart'),
    danger: read('--color-danger'),
    surface: read('--color-surface'),
    fontFamily: read('--font-family'),
  };
}
