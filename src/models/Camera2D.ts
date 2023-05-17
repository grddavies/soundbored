import { Vec2 } from 'src/math';

/**
 * A pannable/zoomable 2D camera position
 */
export type Camera2D = {
  /**
   * Camera pan position
   */
  pan: Vec2;
  /**
   * Camera zoom level
   */
  zoom: Vec2;
};

/**
 * Build a default Camera2D object
 */
export function defaultCamera2D(): Camera2D {
  return {
    pan: { x: 0, y: 0 },
    zoom: { x: 1, y: 1 },
  };
}
