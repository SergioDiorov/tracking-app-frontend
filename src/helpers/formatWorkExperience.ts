export const formatWorkExperience = (months: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const yearsStr = years > 0 ? `${years}y` : '';
  const monthsStr = remainingMonths > 0 ? `${remainingMonths}m` : '';

  return [yearsStr, monthsStr].filter(Boolean).join(' ').trim();
};
