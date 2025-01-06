interface EyeDropperResult {
  sRGBHex: string;
}

interface Window {
  EyeDropper: typeof EyeDropper;
}