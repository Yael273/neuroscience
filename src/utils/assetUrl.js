
export function assetUrl(path) {
  if (!path) return "";

  // Keep external URLs unchanged.
  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL;

  // Prevent adding the base path twice.
  if (path.startsWith(base) && base !== "/") {
    return path;
  }

  return base + path.replace(/^\/+/, "");
}
