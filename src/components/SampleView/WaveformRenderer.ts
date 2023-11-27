import { Mat3 } from 'src/math/Mat3';
import { Vec2 } from 'src/math/Vec';
import { Vec3 } from 'src/math/Vec3';
import { Camera2D } from 'src/models';

const PAD_Y = 0.05;

export class WaveformRenderer {
  readonly _buf: AudioBuffer;

  public points: Vec3[][] = [[]];

  constructor(buffer: AudioBuffer) {
    // Each channels data is stored as [x, y] pairs in a single Float32Array
    this._buf = buffer;
  }

  update(
    { pan, zoom }: Readonly<Camera2D>,
    size: Readonly<{ width: number; height: number }>,
  ): void {
    // Update points
    // create an array of vec3 in normalised sample space
    // apply scale and pan to reach view space
    // for 0 <= x <= size.width: plot the transformed value
    const nSamples = this._buf.length;
    // Compute channel points in normalised space
    const channelPoints = [];
    for (let c = 0; c < this._buf.numberOfChannels; c++) {
      const ps: Vec3[] = [];
      const data = this._buf.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        ps.push(new Vec3(i / nSamples, data[i], 1));
      }
      channelPoints.push(ps);
    }

    const viewPoints: Vec3[][] = [];

    const panMat = Mat3.translate(pan.x, pan.y);
    const zoomMat = Mat3.scale(zoom.x, zoom.y);

    const channelToView = panMat.mul(zoomMat);
    // Use camera to scale and pan
    for (const ch of channelPoints) {
      viewPoints.push(ch.map((v) => channelToView.mulV3(v)));
    }

    // Generate SVG points
    const scaleMat = Mat3.scale(size.width, -(size.height - 2 * PAD_Y));
    const centerMat = Mat3.translate(0, size.height / 2);

    const svgPoints = viewPoints.map((ps) =>
      ps.map((p) => centerMat.mul(scaleMat).mulV3(p)),
    );
    this.points = svgPoints;
  }

  getPaths(): string[] {
    return this.points.map((xs) => WaveformRenderer.getSVGPath(xs));
  }

  static getSVGPath(data: ReadonlyArray<Vec2>): string {
    let dString = `M ${data[0].x} ${data[0].y}`;
    for (let i = 1; i < data.length; i++) {
      dString += ` L${data[i].x} ${data[i].y}`;
    }
    return dString;
  }
}
