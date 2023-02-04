/**
 * TSample
 *
 * Sample file data type
 */
export type TSample = {
  filename: string;
  data: Blob;
  waveform?: Float32Array;
};
