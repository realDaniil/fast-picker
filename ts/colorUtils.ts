export type ColorMode = 'hex' | 'rgb' | 'hsl' | 'cmyk';

export const hexToRgb = (hex: string): string => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

export const hexToHsl = (hex: string): string => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const hexToCmyk = (hex: string): string => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const k = 1 - Math.max(r / 255, g / 255, b / 255);
  const c = (1 - r / 255 - k) / (1 - k) || 0;
  const m = (1 - g / 255 - k) / (1 - k) || 0;
  const y = (1 - b / 255 - k) / (1 - k) || 0;

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
};

export const formatColor = (color: string, mode: ColorMode): string => {
  switch (mode) {
    case 'rgb':
      return hexToRgb(color);
    case 'hsl':
      return hexToHsl(color);
    case 'cmyk':
      return hexToCmyk(color);
    default:
      return color;
  }
};
