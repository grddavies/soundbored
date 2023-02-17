/**
 * Get the filename without extension from a full path
 * @param path full file path
 * @returns
 */
export function getFilename(path: string): string {
  const fileWithExt = path.split(/.*[/|\\]/).at(-1) ?? '';
  return fileWithExt.replace(/\..*$/, '');
}
