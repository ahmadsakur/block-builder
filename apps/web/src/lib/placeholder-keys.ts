export function placeholderKeys(count: number, prefix = "placeholder") {
  return Array.from({ length: count }, (_, index) => `${prefix}-${index}`);
}
