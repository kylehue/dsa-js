import { DisjointSet } from "../src";
import { describe, beforeEach, test, expect } from "vitest";

describe("DisjointSet", () => {
   let ds: DisjointSet<string>;

   beforeEach(() => {
      ds = new DisjointSet<string>();
   });

   test("should add elements correctly", () => {
      expect(ds.add("A")).toBe(true);
      expect(ds.add("B")).toBe(true);
      expect(ds.add("A")).toBe(false); // A is already added
   });

   test("should find elements correctly", () => {
      ds.add("A");
      ds.add("B");
      expect(ds.find("A")).toBe("A");
      expect(ds.find("B")).toBe("B");
      expect(ds.find("C")).toBe(undefined); // C is not added
   });

   test("should return correct representative for new elements", () => {
      expect(ds.findOrAdd("A")).toBe("A");
      expect(ds.findOrAdd("B")).toBe("B");
   });

   test("should unite sets correctly", () => {
      ds.union("A", "B");
      expect(ds.find("A")).toBe("B");
      expect(ds.find("B")).toBe("B");
   });

   test("should not unite already unified sets", () => {
      ds.union("A", "B");
      expect(ds.union("A", "B")).toBe(false); // Already in the same set
   });

   test("should use union by rank", () => {
      ds.union("A", "B");
      ds.union("B", "C");
      expect(ds.find("A")).toBe(ds.find("C"));
   });

   test("should handle multiple unions and finds correctly", () => {
      ds.union("A", "B");
      ds.union("C", "D");
      ds.union("A", "C");
      expect(ds.find("A")).toBe(ds.find("D"));
      expect(ds.find("B")).toBe(ds.find("D"));
      expect(ds.find("C")).toBe(ds.find("D"));
      expect(ds.find("D")).toBe("D");
   });
});
