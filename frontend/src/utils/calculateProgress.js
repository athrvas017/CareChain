export const calculateProgress = (collected, target) => {
  if (target === 0) return 0;
  const progress = Math.round((collected / target) * 100);
  return progress > 100 ? 100 : progress; /* Cap at 100% for UI */
};
