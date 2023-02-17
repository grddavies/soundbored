import { Vec2 } from './Vec';

/**
 * Convert a polar vector to a cartesian vector
 * @param r polar radius
 * @param theta polar angle in radians
 * @returns {Vec2} cartesian vector
 */
export function polarToCartesian(r: number, theta: number): Vec2 {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}
