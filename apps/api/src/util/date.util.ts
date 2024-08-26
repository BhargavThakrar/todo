export const getFutureDate = (days: number) => {
  const futureDate = new Date(
    new Date().getTime() + days * 24 * 60 * 60 * 1000,
  );
  return formatDate(futureDate);
};

export const getPastDate = (days: number) => {
  const pastDate = new Date(
    new Date().getTime() - days * 24 * 60 * 60 * 1000,
  );
  return formatDate(pastDate);
};

export const formatDate = (date: Date): string => {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};
