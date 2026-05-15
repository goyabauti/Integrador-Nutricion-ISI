/**
 * Combines class names, filtering out falsy values.
 * Useful for conditional Tailwind/CSS class merging.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Wraps a fetch call and returns [data, error].
 * Avoids try/catch boilerplate at call sites.
 */
export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<[T | null, Error | null]> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data: T = await res.json();
    return [data, null];
  } catch (err) {
    return [null, err instanceof Error ? err : new Error(String(err))];
  }
}
