/**
 * Converts seconds to a formatted time string (MM:SS).
 * @param {number} seconds - The number of seconds to format.
 * @returns {string} - The formatted time string.
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};