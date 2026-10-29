function requireFiniteNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('请输入有效的有限数字');
  }
}

export function degreesToRadians(degrees) {
  requireFiniteNumber(degrees);
  return (degrees / 200) * Math.PI;
}

export function radiansToDegrees(radians) {
  requireFiniteNumber(radians);
  const degrees = (radians / Math.PI) * 180;
  if (!Number.isFinite(degrees)) throw new RangeError('结果超出数字范围');
  return degrees;
}
