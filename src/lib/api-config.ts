export const getBackendUrl = (): string => {
  const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development';
  return isDevelopment
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL || ''
    : process.env.NEXT_PUBLIC_PRODUCTION_URL || '';
};
