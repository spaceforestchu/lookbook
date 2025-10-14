/** Very small diff helper for shallow objects with string/boolean/array<string> fields */
export type Shallow = Record<string, any>;
export type DiffResult = {
  added: string[];
  removed: string[];
  changed: string[];   // value differs (string/boolean) or array contents differ
  same: string[];
};

function eqArray(a?: string[], b?: string[]) {
  if (!Array.isArray(a) && !Array.isArray(b)) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const A = [...a].sort(); const B = [...b].sort();
  return A.every((v, i) => v === B[i]);
}

export function shallowDiff(oldObj: Shallow, newObj: Shallow): DiffResult {
  const keys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];
  const same: string[] = [];

  for (const k of keys) {
    const o = oldObj?.[k];
    const n = newObj?.[k];
    const hasO = Object.prototype.hasOwnProperty.call(oldObj || {}, k);
    const hasN = Object.prototype.hasOwnProperty.call(newObj || {}, k);

    if (!hasO && hasN) { added.push(k); continue; }
    if (hasO && !hasN) { removed.push(k); continue; }

    if (Array.isArray(o) || Array.isArray(n)) {
      eqArray(o, n) ? same.push(k) : changed.push(k);
    } else {
      (o === n) ? same.push(k) : changed.push(k);
    }
  }

  return { added, removed, changed, same };
}
