export function convertToDateFormat(dateObj: Date): string {

  // Extract day, month, and year from the Date object
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = dateObj.getFullYear();

  // Return the date in dd/mm/yyyy format
  return `${day}/${month}/${year}`;
}