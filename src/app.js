import { degreesToRadians, radiansToDegrees } from './converter.js';

const input = document.querySelector('#angle');
const direction = document.querySelector('#direction');
const output = document.querySelector('#result');

function update() {
  try {
    if (!input.value.trim()) throw new TypeError('请输入角度或弧度');
    const isDegrees = direction.value === 'degrees';
    const convert = isDegrees ? degreesToRadians : radiansToDegrees;
    const result = convert(Number(input.value));
    output.textContent = `${Number(result.toPrecision(10))} ${isDegrees ? 'rad' : '°'}`;
  } catch (error) {
    output.textContent = error.message;
  }
}

input.addEventListener('input', update);
direction.addEventListener('change', update);
update();
