/**
 * Format a date into a readable string
 * @param date The date to format
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
} 