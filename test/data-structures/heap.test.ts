import { Heap } from "../../src/data-structures/heap";
import { describe, beforeEach, it, expect } from "vitest";

describe("Heap", () => {
   let heap: Heap<number>;

   beforeEach(() => {
      heap = new Heap<number>();
   });

   it("should initialize an empty heap", () => {
      expect(heap.size()).toBe(0);
      expect(heap.isEmpty()).toBe(true);
      expect(heap.peek()).toBeNull();
   });

   it("should add elements to the heap", () => {
      heap.push(5, 10, 3);

      expect(heap.size()).toBe(3);
      expect(heap.isEmpty()).toBe(false);
      expect(heap.peek()).toBe(3);
   });

   it("should remove the top element from the heap", () => {
      heap.push(5, 10, 3);

      expect(heap.pop()).toBe(3);
      expect(heap.size()).toBe(2);
      expect(heap.peek()).toBe(5);
   });

   it("should clear the heap", () => {
      heap.push(5, 10, 3);

      heap.clear();

      expect(heap.size()).toBe(0);
      expect(heap.isEmpty()).toBe(true);
      expect(heap.peek()).toBeNull();
   });

   it("should clone the heap", () => {
      heap.push(5, 10, 3);

      const clonedHeap = heap.clone();

      expect(clonedHeap.size()).toBe(heap.size());
      expect(clonedHeap.isEmpty()).toBe(heap.isEmpty());
      expect(clonedHeap.peek()).toBe(heap.peek());
   });

   it("should convert the heap to an array", () => {
      heap.push(5, 10, 3);

      const array = heap.toArray();

      expect(array).toEqual([3, 5, 10]);
      expect(heap.size()).toBe(3); // Ensure original heap is unchanged
   });

   it("should build a heap from an array", () => {
      const array = [5, 10, 3];
      const builtHeap = Heap.fromArray(array);

      expect(builtHeap.size()).toBe(array.length);
      expect(builtHeap.peek()).toBe(3);
   });

   it("should handle duplicate elements", () => {
      heap.push(5, 10, 5, 3, 10, 3);

      expect(heap.size()).toBe(6);
      expect(heap.peek()).toBe(3);

      const array = heap.toArray();
      expect(array).toEqual([3, 3, 5, 5, 10, 10]);
   });

   it("should handle pop on an empty heap", () => {
      expect(heap.pop()).toBeNull();
      expect(heap.isEmpty()).toBe(true);
   });

   it("should maintain heap property after multiple operations", () => {
      heap.push(20, 15, 10, 5, 25);

      expect(heap.pop()).toBe(5);
      expect(heap.peek()).toBe(10);

      heap.push(2);
      expect(heap.peek()).toBe(2);
   });

   it("should support custom comparator for a max heap", () => {
      const maxHeap = new Heap<number>((a, b) => b - a);

      maxHeap.push(1, 5, 3, 7, 2);

      expect(maxHeap.peek()).toBe(7);
      expect(maxHeap.pop()).toBe(7);
      expect(maxHeap.pop()).toBe(5);
      expect(maxHeap.toArray()).toEqual([3, 2, 1]);
   });

   it("should handle edge case with a single element", () => {
      heap.push(42);

      expect(heap.size()).toBe(1);
      expect(heap.peek()).toBe(42);
      expect(heap.pop()).toBe(42);
      expect(heap.isEmpty()).toBe(true);
   });

   it("should handle a large number of elements", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => 1000 - i);
      const largeHeap = Heap.fromArray(largeArray);

      expect(largeHeap.size()).toBe(1000);
      expect(largeHeap.peek()).toBe(1);
   });

   it("should maintain heap property with negative numbers", () => {
      heap.push(-10, -20, -5, -15);

      expect(heap.peek()).toBe(-20);
      expect(heap.toArray()).toEqual([-20, -15, -10, -5]);
   });
});
