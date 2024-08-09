import { Deque } from "../../src/data-structures/deque";
import { describe, beforeEach, test, expect } from "vitest";

describe("Deque", () => {
   let deque: Deque<number>;

   beforeEach(() => {
      deque = new Deque<number>();
   });

   test("should add elements to the front", () => {
      deque.addFront(1);
      deque.addFront(2);
      expect(deque.front()).toBe(2);
      expect(deque.back()).toBe(1);
   });

   test("should remove elements from the back", () => {
      deque.addFront(1);
      deque.addFront(2);
      expect(deque.removeBack()).toBe(1);
      expect(deque.removeBack()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
   });

   test("should handle adding to an empty deque", () => {
      deque.addFront(1);
      expect(deque.front()).toBe(1);
      expect(deque.back()).toBe(1);
   });

   test("should handle removing from an empty deque", () => {
      expect(deque.removeBack()).toBeNull();
   });

   test("should handle adding and removing multiple elements", () => {
      deque.addFront(1);
      deque.addFront(2);
      deque.addFront(3);
      expect(deque.removeBack()).toBe(1);
      expect(deque.removeBack()).toBe(2);
      expect(deque.removeBack()).toBe(3);
      expect(deque.isEmpty()).toBe(true);
   });
});
