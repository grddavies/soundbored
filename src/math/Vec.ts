export type Vec2 = {
  x: number;
  y: number;
};

export function Vec2Add(...xs: Vec2[]) {
  return xs.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }));
}
