import { Deque } from "../src";
import { describe, beforeEach, test, expect } from "vitest";

describe("Deque", () => {
   let deque: Deque<number>;

   beforeEach(() => {
      deque = new Deque<number>();
   });

   test("should add elements to the front", () => {
      deque.enqueueFront(1);
      deque.enqueueFront(2);
      expect(deque.front()).toBe(2);
      expect(deque.back()).toBe(1);
   });

   test("should remove elements from the back", () => {
      deque.enqueueFront(1);
      deque.enqueueFront(2);
      expect(deque.dequeueBack()).toBe(1);
      expect(deque.dequeueBack()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
   });

   test("should handle adding to an empty deque", () => {
      deque.enqueueFront(1);
      expect(deque.front()).toBe(1);
      expect(deque.back()).toBe(1);
   });

   test("should handle removing from an empty deque", () => {
      expect(deque.dequeueBack()).toBeUndefined();
   });

   test("should handle adding and removing multiple elements", () => {
      deque.enqueueFront(1);
      deque.enqueueFront(2);
      deque.enqueueFront(3);
      expect(deque.dequeueBack()).toBe(1);
      expect(deque.dequeueBack()).toBe(2);
      expect(deque.dequeueBack()).toBe(3);
      expect(deque.isEmpty()).toBe(true);
   });
});
