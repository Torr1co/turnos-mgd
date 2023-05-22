export const hasKey = <O extends Record<string | number | symbol, unknown>>(
  obj: O,
  key: string | number | symbol
): key is keyof O => key in obj || !!obj[key];

type Expand<T> = {
  [K in keyof T as Extract<K, string> extends `${infer Prefix}|${infer Suffix}`
    ? Prefix | Suffix
    : K]: T[K];
};

export function expand<O extends Record<string, string | number | symbol>>(
  obj: O
): Expand<O> {
  return new Proxy(obj as Expand<O>, {
    get: function (target, property) {
      if (typeof property !== "string") return null;
      for (const key in target)
        if (new RegExp(key).test(property)) return target[key];
      return null;
    },
  });
}

export function nullToUndefined<T extends Record<string, unknown | null>>(
  obj: T
): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null ? undefined : value,
    ])
  ) as T;
}
