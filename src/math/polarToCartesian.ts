import { Vec2 } from './Vec';

/**
 * Convert a polar vector to a cartesian vector
 * @param r - Polar radius
 * @param theta - Polar angle in radians
 * @returns Cartesian vector
 */
export function polarToCartesian(r: number, theta: number): Vec2 {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}
