/**
 * Swaps two elements in an array.
 */
export function swap<T>(array: T[], i: number, j: number): void {
   let temp = array[i];
   array[i] = array[j];
   array[j] = temp;
}
