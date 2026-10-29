import test from 'node:test';
import assert from 'node:assert/strict';
import { degreesToRadians, radiansToDegrees } from '../src/converter.js';

function closeTo(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} should equal ${expected}`);
}

test('180 degrees equals pi radians', () => closeTo(degreesToRadians(180), Math.PI));
test('90 degrees equals half pi radians', () => closeTo(degreesToRadians(90), Math.PI / 2));
test('pi radians equals 180 degrees', () => closeTo(radiansToDegrees(Math.PI), 180));
test('zero stays zero in both directions', () => {
  assert.equal(degreesToRadians(0), 0);
  assert.equal(radiansToDegrees(0), 0);
});
test('negative angles and full turns remain meaningful', () => {
  closeTo(degreesToRadians(-90), -Math.PI / 2);
  closeTo(radiansToDegrees(2 * Math.PI), 360);
});
test('fractional values survive a round trip', () => {
  for (const degrees of [-720, -12.5, 0.25, 45, 123.456, 720]) {
    closeTo(radiansToDegrees(degreesToRadians(degrees)), degrees);
  }
});
test('invalid input is rejected instead of producing misleading results', () => {
  for (const value of [NaN, Infinity, -Infinity, '180', null, undefined]) {
    assert.throws(() => degreesToRadians(value), TypeError);
    assert.throws(() => radiansToDegrees(value), TypeError);
  }
});
test('large degree inputs avoid unnecessary intermediate overflow', () => {
  assert.ok(Number.isFinite(degreesToRadians(Number.MAX_VALUE)));
});
test('unrepresentable results produce a clear error', () => {
  assert.throws(() => radiansToDegrees(Number.MAX_VALUE), RangeError);
});
