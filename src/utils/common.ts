/**
 * Swaps two elements in an array.
 */
export function swap<T>(array: T[], i: number, j: number): void {
   let temp = array[i];
   array[i] = array[j];
   array[j] = temp;
}

/**
 * Checks if two intervals are overlapping.
 *
 * Note: It returns false if the two intervals are just touching.
 *
 * @param lowA Lower bound of interval A.
 * @param highA Upper bound of interval A.
 * @param lowB Lower bound of interval B.
 * @param highB Upper bound of interval B.
 *
 * @returns True if the two intervals are overlapping, otherwise false.
 */
export function isOverlapping(
   lowA: number,
   highA: number,
   lowB: number,
   highB: number
): boolean {
   if (lowA > highA || lowB > highB) {
      throw new RangeError("Lower bound must be less than the higher bound.");
   }
   return lowA < highB && lowB < highA;
}
