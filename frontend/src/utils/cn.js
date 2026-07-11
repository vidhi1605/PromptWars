/**
 * Combines multiple class names into a single string.
 * Filters out falsy values.
 * 
 * @param {...(string|boolean|undefined|null)} inputs 
 * @returns {string}
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
