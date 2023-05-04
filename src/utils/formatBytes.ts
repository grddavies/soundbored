const IEC_UNITS = [
  'Bytes',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
];
const SI_UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

/**
 * Get a human readable representation of a number of bytes
 *
 * @param bytes number of bytes to represent
 * @param si use si (base 10) or IEC units (base 2)
 * @param fractionDigits (default 2) number of digits after the decimal point 0-20
 */
export function formatBytes(
  bytes: number,
  si = false,
  fractionDigits = 2,
): string {
  const k = si ? 1000 : 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(fractionDigits)} ${
    si ? SI_UNITS[i] : IEC_UNITS[i]
  }`;
}
