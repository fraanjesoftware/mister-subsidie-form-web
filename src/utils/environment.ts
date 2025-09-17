export const isLocalHostname = (hostname: string): boolean => {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('127.') ||
    hostname === '[::1]' ||
    hostname.endsWith('.local')
  );
};

export const isLocalEnvironment = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return isLocalHostname(window.location.hostname);
};
