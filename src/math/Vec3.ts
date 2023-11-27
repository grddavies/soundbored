import { vec3 } from 'gl-matrix';

export class Vec3 {
  public get x(): number {
    return this.glVec[0];
  }

  public get y(): number {
    return this.glVec[1];
  }

  public get z(): number {
    return this.glVec[2];
  }

  public readonly glVec: vec3;

  /**
   * Constructs a new Vec3 instance
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   */
  constructor(x = 0, y = 0, z = 0) {
    this.glVec = vec3.fromValues(x, y, z);
  }

  /**
   * subtract scalar or vector v from this vector
   * @param v - scalar or vector to subtract from this vector
   * @param out - destination Vec3
   */
  public sub(v: number, out: Vec3): Vec3;
  public sub(v: Vec3, out: Vec3): Vec3;
  public sub(v: number | Vec3, out = new Vec3()): Vec3 {
    if (v instanceof Vec3) {
      vec3.subtract(out.glVec, this.glVec, v.glVec);
    } else if (typeof v === 'number') {
      vec3.sub(out.glVec, this.glVec, vec3.fromValues(v, v, v));
    } else {
      throw Error('Not implemented');
    }
    return out;
  }

  /**
   * add a scalar or vector v to this vector
   * @param v - scalar or vector to add to this vector
   * @param out - destination Vec3
   */
  public add(v: number, out: Vec3): Vec3;
  public add(v: Vec3, out: Vec3): Vec3;
  public add(v: number | Vec3, out = new Vec3()): Vec3 {
    if (v instanceof Vec3) {
      vec3.add(out.glVec, this.glVec, v.glVec);
    } else if (typeof v === 'number') {
      vec3.add(out.glVec, this.glVec, vec3.fromValues(v, v, v));
    } else {
      throw Error('Not implemented');
    }
    return out;
  }
}
