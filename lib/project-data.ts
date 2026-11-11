/** Accept legacy JSON strings while keeping malformed records safe to render. */
export function parseProjectList(value: unknown): string[] {
  for (let depth = 0; depth < 3 && typeof value === 'string'; depth++) {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }
  return isStringArray(value) ? value : [];
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}
