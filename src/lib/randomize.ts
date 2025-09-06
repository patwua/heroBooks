import { cookies, headers } from "next/headers";

/**
 * Choose one item from a pool based on a stored cookie value.
 * If the cookie is absent or invalid, choose randomly without persisting.
 */
export function chooseOnce<T>(cookieName: string, pool: T[]): T {
  headers(); // ensure dynamic segment
  const jar = cookies();
  const idx = Number(jar.get(cookieName)?.value ?? NaN);
  if (!Number.isNaN(idx) && idx >= 0 && idx < pool.length) {
    return pool[idx];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Choose N unique items from a pool based on stored cookie indices.
 * If the cookie is absent or invalid, choose randomly without persisting.
 */
export function chooseNOnce<T>(cookieName: string, pool: T[], n: number): T[] {
  headers(); // ensure dynamic segment
  const jar = cookies();
  const raw = jar.get(cookieName)?.value;
  if (raw) {
    try {
      const arr = JSON.parse(raw) as number[];
      if (Array.isArray(arr) && arr.every((x) => Number.isInteger(x) && x >= 0 && x < pool.length)) {
        return arr.slice(0, n).map((i) => pool[i]);
      }
    } catch {
      /* ignore */
    }
  }

  const all = [...pool.keys()];
  // Fisher-Yates for first n
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all
    .slice(0, Math.min(n, pool.length))
    .map((i) => pool[i]);
}
