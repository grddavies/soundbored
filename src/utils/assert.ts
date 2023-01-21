export function assert(test: unknown, message?: string) {
  if (!test) {
    throw new Error(message);
  }
}
