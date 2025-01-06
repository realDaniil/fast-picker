import { ColorMode, formatColor, hexToRgb, hexToHsl, hexToCmyk } from './colorUtils.js';

const eyeDropper = new window.EyeDropper();
const pickBtn = document.querySelector('#pick-color') as HTMLButtonElement;
const pickedColorsContainer = document.querySelector('.picked-colors') as HTMLElement;
const copiedHolder = document.querySelector('.copied-holder') as HTMLElement;
const lastColorContainer = document.querySelector('.last-color') as HTMLElement;
const modeButton = document.querySelector('#mode') as HTMLButtonElement;
const closeOnPickCheckbox = document.querySelector('#close-on-pick') as HTMLInputElement;

const savedColors = localStorage.getItem('pickedColors');
const pickedColors: string[] = savedColors ? JSON.parse(savedColors) : ['#007bff'];

let mode: ColorMode = 'hex';

const updatePickedColors = (isAnimate = false) => {
  pickedColorsContainer.innerHTML = '';
  lastColorContainer.innerHTML = formatColor(pickedColors[0], mode);
  pickedColors.forEach((color, index) => {
    const colorDiv = document.createElement('div');
    colorDiv.className = isAnimate && index === 0 ? 'color animate' : 'color';
    colorDiv.setAttribute('data-color', formatColor(color, mode));
    colorDiv.style.backgroundColor = color;
    pickedColorsContainer.appendChild(colorDiv);
  });

  localStorage.setItem('pickedColors', JSON.stringify(pickedColors));
};
updatePickedColors();

const addColor = (color: string) => {
  pickedColors.unshift(color);

  if (pickedColors.length > 5) {
    pickedColors.pop();
  }

  lastColorContainer.innerHTML = formatColor(pickedColors[0], mode);
  updatePickedColors(true);
};

pickedColorsContainer.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target && target.classList.contains('color')) {
    const color = target.style.backgroundColor;

    navigator.clipboard
      .writeText(color)
      .then(() => {
        copiedHolder.innerHTML = '';
        const copiedDiv = document.createElement('div');
        copiedDiv.classList.add('copied-notification');
        copiedDiv.innerHTML = `Copied <b>${color}</b>`;
        copiedHolder.appendChild(copiedDiv);
      })
      .catch((err) => {
        console.error('Failed to copy color:', err);
      });
  }
});

pickBtn.addEventListener('click', () => {
  if (closeOnPickCheckbox.checked) {
    document.body.classList.add('hidden');
  }
  setTimeout(() => {
    eyeDropper
      .open()
      .then((res: EyeDropperResult) => {
        addColor(res.sRGBHex);
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => {
        document.body.classList.remove('hidden');
      });
  }, 0);
});

modeButton.addEventListener('click', () => {
  const modes: ColorMode[] = ['hex', 'rgb', 'hsl', 'cmyk'];
  mode = modes[(modes.indexOf(mode) + 1) % modes.length];
  modeButton.textContent = mode;
  updatePickedColors();
});
