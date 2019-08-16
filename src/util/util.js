export function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str) {
  return trim(str).split(/\s+/);
}
