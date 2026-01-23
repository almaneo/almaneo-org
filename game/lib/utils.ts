/**
 * Format a number with commas for thousands
 * Example: 1000 -> "1,000"
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  return num.toLocaleString('en-US');
}

/**
 * Format large numbers with K, M, B suffix
 * Example: 1500 -> "1.5K"
 */
export function formatLargeNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1_000_000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  if (num < 1_000_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  
  return (num / 1_000_000_000).toFixed(1) + 'B';
}
