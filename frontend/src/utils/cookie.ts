export const getCookie = (name: string): string | null => {
  // Try to get cookie from document.cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;

  // Try to get it from localStorage as fallback
  return localStorage.getItem(`cookie_${name}`) || null;
};

export const setCookie = (name: string, value: string, options: { expires?: Date; path?: string } = {}) => {
  const updatedOptions = {
    expires: options.expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 days
    path: options.path || '/',
  };

  // Set cookie in document.cookie
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${updatedOptions.expires.toUTCString()}`,
    `path=${updatedOptions.path}`,
    'SameSite=None',
    'Secure'
  ].join('; ');

  // Also store in localStorage as fallback
  localStorage.setItem(`cookie_${name}`, value);
};
