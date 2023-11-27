import { Mat3 } from '../Mat3';
import { Vec3 } from '../Vec3';

const PRECISION_DIGITS = 6;

test('Identity', () => {
  const I = Mat3.identity();
  const sum = [...I.glMat].reduce((p, x) => p + x);
  expect(sum).toBe(3);
  expect([I.glMat[0], I.glMat[4], I.glMat[8]]).toEqual([1, 1, 1]);
});

test('A Matrix inverse multiplied by itself is identity', () => {
  for (let i = 0; i < 5; i++) {
    const M = Mat3.random();
    const inv = M.invert();
    const result = M.mul(inv);
    result.glMat.forEach((x, i) => {
      expect(x).toBeCloseTo([0, 4, 8].includes(i) ? 1 : 0, PRECISION_DIGITS);
    });
  }
});

test.each([
  [[1, 1, 1], 0, 0, [1, 1, 1]],
  [[1, 1, 1], 1, -1, [2, 0, 1]],
  [[2, 2, 1], 1, -1, [3, 1, 1]],
])(
  'Translation of (%s) by (%s, %s), ',
  ([x0, y0, z0], tx, ty, [x1, y1, z1]) => {
    const mat = Mat3.translate(tx, ty);
    const result = mat.mulV3(new Vec3(x0, y0, z0));
    expect([result.x, result.y, result.z]).toEqual([x1, y1, z1]);
  },
);

test.each([
  [[1, 1, 1], 0, 0, [0, 0, 1]],
  [[1, 1, 1], 1, 1, [1, 1, 1]],
  [[2, 2, 1], 2, 0.5, [4, 1, 1]],
  [[2, 2, 1], -1, -1, [-2, -2, 1]],
  [[4, 2, 1], -0.25, 0.5, [-1, 1, 1]],
])('Scale of (%s) by (%s, %s), ', ([x0, y0, z0], tx, ty, [x1, y1, z1]) => {
  const mat = Mat3.scale(tx, ty);
  const result = mat.mulV3(new Vec3(x0, y0, z0));
  expect([result.x, result.y, result.z]).toEqual([x1, y1, z1]);
});
