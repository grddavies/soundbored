export type Vec2 = {
  x: number;
  y: number;
};

/**
 * Add multiple vectors
 * @param xs - Vectors to add
 * @returns
 */
export function Vec2Add(...xs: Vec2[]): Vec2 {
  return xs.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }));
}

/**
 * Subtract multiple vectors
 * @param xs - Vectors to subtract
 * @returns
 */
export function Vec2Sub(...xs: Vec2[]): Vec2 {
  return xs.reduce((a, b) => ({ x: a.x - b.x, y: a.y - b.y }));
}
