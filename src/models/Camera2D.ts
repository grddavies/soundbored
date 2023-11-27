import { Vec2 } from 'src/math';

/**
 * A pannable/zoomable 2D camera position
 */
export type Camera2D = {
  /**
   * Camera pan offset
   *
   * Valid in range [0, 1 - 1/zoom]
   */
  pan: Vec2;
  /**
   * Camera zoom factor
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
