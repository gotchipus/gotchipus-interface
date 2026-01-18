export const formatAddress = (address: string | undefined): string => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const calculateLevel = (currentExp: number): number => {
  return Math.floor(Number(currentExp) / 100);
};

export const calculateExpProgress = (currentExp: number): number => {
  return Math.floor(((Number(currentExp) / 100) % 1) * 100);
};

export const calculateExpPercentage = (currentExp: number): number => {
  return ((Number(currentExp) / 100) % 1) * 100;
};

export const calculateAge = (birthTime: number | undefined): number => {
  if (!birthTime) return 0;
  return Math.floor((Date.now() / 1000 - birthTime) / 86400);
};

export const formatBirthTime = (birthTime: number | undefined): string => {
  if (!birthTime) return 'N/A';
  return new Date(birthTime * 1000).toLocaleString();
};

export const formatAttribute = (value: number | undefined): number => {
  return (value || 0) / 100;
};
