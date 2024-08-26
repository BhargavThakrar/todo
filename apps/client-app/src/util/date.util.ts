export const isDateInvalid = (utcDate: string) => isNaN(Date.parse(utcDate));

export const isDatePastdue = (utcDate: string): boolean => {
  if (isDateInvalid(utcDate)) return true;

  const givenDate = new Date(utcDate);
  const currentDate = new Date();

  // Normalize both dates to midnight to compare only the dates (not times)
  givenDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return givenDate < currentDate
};

export const formatDate = (utcDate: string, { withTime }: {
  withTime: boolean
}): string => {
  const dateObject = new Date(utcDate);

  if (isDateInvalid(utcDate)) return utcDate;

  return withTime
    ? dateObject.toLocaleString()
    : dateObject.toLocaleString().split(',')[0]
}

export const getCurrentDate = (): string => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export const getDateFromUtc = (utcDate: string): string => {
  if (isDateInvalid(utcDate)) return utcDate;

  return utcDate.split('T')[0];
};
