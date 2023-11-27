import { glMatrix, mat3 } from 'gl-matrix';

import { Vec3 } from './Vec3';

// May improve performance on modern browsers: https://github.com/toji/gl-matrix
glMatrix.setMatrixArrayType(Array);

/**
 * 3x3 Matrix backed by a GL vector
 */
export class Mat3 {
  /**
   * Matrix multiplication with a 3D vector
   */
  public mulV3(vec: Vec3, out = new Vec3()): Vec3 {
    const x = vec.glVec[0];
    const y = vec.glVec[1];
    const z = vec.glVec[2];
    const m = this.glMat;
    out.glVec[0] = x * m[0] + y * m[3] + z * m[6];
    out.glVec[1] = x * m[1] + y * m[4] + z * m[7];
    out.glVec[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }

  /**
   * Matrix multiplication with 3D Matrix
   * This * M
   * @param right - the 3D matrix on the rhs of the multiplication
   */
  public mul(right: Mat3, out = new Mat3()): Mat3 {
    mat3.mul(out.glMat, this.glMat, right.glMat);
    return out;
  }
  /**
   * Invert this Mat3
   * @param out - the receiving matrix.
   */
  public invert(out = new Mat3()): Mat3 {
    mat3.invert(out.glMat, this.glMat);
    return out;
  }

  /**
   * Constructs a new Matrix3 instance.
   * @param m00 - Component in column 0, row 0
   * @param m01 - Component in column 0, row 1
   * @param m02 - Component in column 0, row 2
   * @param m10 - Component in column 1, row 0
   * @param m11 - Component in column 1, row 1
   * @param m12 - Component in column 1, row 2
   * @param m20 - Component in column 2, row 0
   * @param m21 - Component in column 2, row 1
   * @param m22 - Component in column 2, row 2
   */
  constructor(
    m00 = 0,
    m01 = 0,
    m02 = 0,
    m10 = 0,
    m11 = 0,
    m12 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 0,
  ) {
    this.glMat = mat3.fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22);
  }

  public readonly glMat: mat3;

  /**
   * Construct the identity matrix
   */
  public static identity(): Mat3 {
    return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  /**
   * Construct a matrix filled with zeros
   */
  public static zeros(): Mat3 {
    return new Mat3(...Array(9).fill(0));
  }

  /**
   * Construct a matrix of pseudorandom numbers in range (0, 1)
   */
  public static random(): Mat3 {
    return new Mat3(...Array(9).fill(null).map(Math.random));
  }

  /**
   * Construct a matrix that performs a translation
   */
  public static translate(x: number, y: number): Mat3 {
    return new Mat3(1, 0, 0, 0, 1, 0, x, y, 1);
  }

  /**
   * Construct a matrix that performs a scaling
   */
  public static scale(x: number, y = 1): Mat3 {
    return new Mat3(x, 0, 0, 0, y, 0, 0, 0, 1);
  }
}
