const pageUrl = () => (typeof document === "undefined" ? undefined : document.baseURI);

const urlOf = (src: string, base?: string) => {
  try {
    return new URL(src, base);
  } catch {
    return undefined;
  }
};

const sameOrigin = (url: URL, base?: string) => base !== undefined && url.origin === urlOf(base)?.origin;

export const showsImage = (src: string, hosts?: string[], base = pageUrl()) => {
  if (!hosts) return true;
  const url = urlOf(src, base);
  if (!url) return false;
  return sameOrigin(url, base) || hosts.some((allowed) => allowed.toLowerCase() === url.host);
};
