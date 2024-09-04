import { Queue } from "../src";
import { describe, beforeEach, test, expect } from "vitest";

describe("Queue", () => {
   let queue: Queue<number>;

   beforeEach(() => {
      queue = new Queue<number>();
   });

   test("should enqueue values correctly", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size()).toBe(3);
      expect(queue.front()).toBe(1);
      expect(queue.back()).toBe(3);
   });

   test("should dequeue values correctly", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.size()).toBe(1);
      expect(queue.front()).toBe(3);
      expect(queue.back()).toBe(3);
   });

   test("should return null when dequeueing from an empty queue", () => {
      expect(queue.dequeue()).toBeUndefined();
   });

   test("should return the correct front and back values", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.front()).toBe(1);
      expect(queue.back()).toBe(3);
   });

   test("should clear the queue correctly", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.clear();

      expect(queue.size()).toBe(0);
      expect(queue.front()).toBeUndefined();
      expect(queue.back()).toBeUndefined();
   });

   test("should clone the queue correctly", () => {
      queue.enqueue(1);
      queue.enqueue(2);

      const clonedQueue = queue.clone();

      expect(clonedQueue.size()).toBe(2);
      expect(clonedQueue.front()).toBe(1);
      expect(clonedQueue.back()).toBe(2);
   });

   test("should convert to array correctly", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.toArray()).toEqual([1, 2, 3]);
   });

   test("should create a queue from an array", () => {
      const newQueue = Queue.fromArray([1, 2, 3]);

      expect(newQueue.size()).toBe(3);
      expect(newQueue.front()).toBe(1);
      expect(newQueue.back()).toBe(3);
   });

   test("should iterate over queue values", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      const values: number[] = [];
      for (const value of queue) {
         values.push(value);
      }

      expect(values).toEqual([1, 2, 3]);
   });
});
