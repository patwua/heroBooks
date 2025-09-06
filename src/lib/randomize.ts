import { cookies, headers } from "next/headers";

/**
 * Choose one item from a pool and persist in a readable cookie for ~12h.
 */
export function chooseOnce<T>(cookieName: string, pool: T[]): T {
  headers(); // ensure dynamic segment
  const jar = cookies();
  let idx = Number(jar.get(cookieName)?.value ?? NaN);
  if (Number.isNaN(idx) || idx < 0 || idx >= pool.length) {
    idx = Math.floor(Math.random() * pool.length);
    jar.set(cookieName, String(idx), { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 12 });
  }
  return pool[idx];
}

/**
 * Choose N unique items from a pool and persist their indices for ~12h.
 */
export function chooseNOnce<T>(cookieName: string, pool: T[], n: number): T[] {
  headers(); // ensure dynamic segment
  const jar = cookies();
  const raw = jar.get(cookieName)?.value;
  let pickedIdx: number[] | null = null;

  if (raw) {
    try {
      const arr = JSON.parse(raw) as number[];
      if (Array.isArray(arr) && arr.every((x) => Number.isInteger(x) && x >= 0 && x < pool.length)) {
        pickedIdx = arr.slice(0, n);
      }
    } catch {
      /* ignore */
    }
  }

  if (!pickedIdx || pickedIdx.length !== n) {
    const all = [...pool.keys()];
    // Fisher-Yates for first n
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    pickedIdx = all.slice(0, Math.min(n, pool.length));
    jar.set(cookieName, JSON.stringify(pickedIdx), { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 12 });
  }

  return pickedIdx.map((i) => pool[i]);
}
