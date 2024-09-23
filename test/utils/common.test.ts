import { describe, it, expect } from "vitest";
import { swap, isOverlapping } from "../../src/utils/common";

describe("swap", () => {
   it("should swap two elements in an array", () => {
      const arr = [1, 2, 3];
      swap(arr, 0, 2);
      expect(arr).toEqual([3, 2, 1]);
   });

   it("should not change the array if the same indices are provided", () => {
      const arr = [1, 2, 3];
      swap(arr, 1, 1);
      expect(arr).toEqual([1, 2, 3]);
   });

   it("should handle swapping when array contains different types", () => {
      const arr = [1, "a", true];
      swap(arr, 0, 2);
      expect(arr).toEqual([true, "a", 1]);
   });
});

describe("isOverlapping", () => {
   it("should return true for overlapping intervals", () => {
      expect(isOverlapping(1, 5, 4, 8)).toBe(true);
   });

   it("should return false for non-overlapping intervals", () => {
      expect(isOverlapping(1, 5, 6, 8)).toBe(false);
   });

   it("should return false for touching intervals", () => {
      expect(isOverlapping(1, 5, 5, 8)).toBe(false);
   });

   it("should throw an error if any lower bound is greater than the upper bound", () => {
      expect(() => isOverlapping(5, 1, 4, 8)).toThrow(RangeError);
      expect(() => isOverlapping(1, 5, 8, 4)).toThrow(RangeError);
   });

   it("should handle equal intervals as overlapping", () => {
      expect(isOverlapping(2, 5, 2, 5)).toBe(true);
   });
});
