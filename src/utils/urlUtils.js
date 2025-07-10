export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

export const extractPageUrl = (url) => {
  try {
    const { origin, pathname, search } = new URL(url);
    return `${origin}${pathname}${search}`;
  } catch {
    return url;
  }
};
