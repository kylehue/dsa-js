import { describe, it, expect, beforeEach } from "vitest";
import { LRUCache } from "../src";

describe("LRUCache", () => {
   let cache: LRUCache<string, number>;

   beforeEach(() => {
      cache = new LRUCache(3);
   });

   it("should add and retrieve elements", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
   });

   it("should return undefined for non-existent keys", () => {
      expect(cache.get("nonexistent")).toBeUndefined();
   });

   it("should remove the least recently used item when capacity is exceeded", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // This should remove 'a' as it was the least recently used
      cache.set("d", 4);

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
   });

   it("should update an existing item and mark it as the most recently used", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // Update 'a'
      cache.set("a", 10);

      // Now 'b' should be the least recently used
      cache.set("d", 4);

      expect(cache.get("a")).toBe(10);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
   });

   it("should return true if an element exists", () => {
      cache.set("a", 1);
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
   });

   it("should delete an element", () => {
      cache.set("a", 1);
      expect(cache.delete("a")).toBe(true);
      expect(cache.get("a")).toBeUndefined();
   });

   it("should return false if deleting a non-existent element", () => {
      expect(cache.delete("nonexistent")).toBe(false);
   });

   it("should clear the cache", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBeUndefined();
   });

   it("should return the correct size", () => {
      expect(cache.size()).toBe(0);
      cache.set("a", 1);
      expect(cache.size()).toBe(1);
      cache.set("b", 2);
      expect(cache.size()).toBe(2);
      cache.delete("a");
      expect(cache.size()).toBe(1);
   });

   it("should iterate over the entries", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      let entries = [...cache.entries()];
      expect(entries).toEqual([
         ["a", 1],
         ["b", 2],
         ["c", 3],
      ]);
   });

   it("should iterate over the values", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      let values = [...cache.values()];
      expect(values).toEqual([1, 2, 3]);
   });

   it("should iterate over the keys", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      let keys = [...cache.keys()];
      expect(keys).toEqual(["a", "b", "c"]);
   });

   it("should support for-of iteration", () => {
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      let entries: [string, number][] = [];
      for (let entry of cache) {
         entries.push(entry);
      }

      expect(entries).toEqual([
         ["a", 1],
         ["b", 2],
         ["c", 3],
      ]);
   });
});
