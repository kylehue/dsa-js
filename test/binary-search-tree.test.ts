import { describe, beforeEach, test, expect } from "vitest";
import { BinarySearchTree } from "../src";

describe("BinarySearchTree", () => {
   let bst: BinarySearchTree;

   beforeEach(() => {
      bst = new BinarySearchTree();
   });

   test("should initialize an empty BinarySearchTree", () => {
      expect(bst.isEmpty()).toBe(true);
      expect(bst.size()).toBe(0);
      expect(bst.height()).toBe(0);
   });

   test("should insert values and maintain the correct size", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);
      expect(bst.size()).toBe(3);
      expect(bst.height()).toBe(2);
      expect(bst.min()).toBe(10);
      expect(bst.max()).toBe(30);
   });

   test("should maintain balance after insertions", () => {
      bst.insert(30);
      bst.insert(20);
      bst.insert(10);
      expect(bst.size()).toBe(3);
      expect(bst.height()).toBe(2);
      expect(bst.min()).toBe(10);
      expect(bst.max()).toBe(30);
   });

   test("should delete a leaf node", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);
      expect(bst.height()).toBe(2);
      expect(bst.size()).toBe(3);
      expect(bst.min()).toBe(10);
      expect(bst.max()).toBe(30);

      expect(bst.delete(30)).toBeFalsy(); // 30 has no successor
      expect(bst.height()).toBe(2);
      expect(bst.size()).toBe(2);
      expect(bst.min()).toBe(10);
      expect(bst.max()).toBe(20);

      expect(bst.delete(10)).toBeFalsy(); // 10 has no successor
      expect(bst.height()).toBe(1);
      expect(bst.size()).toBe(1);
      expect(bst.min()).toBe(20);
      expect(bst.max()).toBe(20);

      expect(bst.delete(1234)).toBeFalsy();
      expect(bst.delete(10)).toBeFalsy();
      expect(bst.delete(30)).toBeFalsy();
   });

   test("should pass successor after deletion", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(15);
      expect(bst.delete(15)?.value()).toBe(20);
      expect(bst.size()).toBe(2);
      expect(bst.max()).toBe(20);
   });

   test("should delete a node with one child", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(15);
      bst.delete(20);
      expect(bst.size()).toBe(2);
      expect(bst.max()).toBe(15);
   });

   test("should delete a node with two children", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(15);
      bst.delete(10);
      expect(bst.size()).toBe(2);
      expect(bst.min()).toBe(15);
   });

   test("should delete properly", () => {
      bst.insert(1);
      bst.insert(2);
      bst.insert(3);
      bst.insert(4);
      bst.insert(5);
      bst.insert(6);
      bst.insert(7);
      expect(bst.size()).toBe(7);

      bst.delete(4);
      bst.delete(5);
      bst.delete(6);
      bst.delete(7);

      expect(bst.size()).toBe(3);
      expect(bst.root()!.value()).toBe(2);
      expect(bst.root()!.left()!.value()).toBe(1);
      expect(bst.root()!.right()!.value()).toBe(3);
   });

   test("should filter", () => {
      for (let i = 1; i <= 100; i++) {
         bst.insert(i);
      }
      expect(bst.size()).toBe(100);
      expect(bst.max()).toBe(100);
      expect(bst.min()).toBe(1);

      // should not delete any
      bst.filter((x) => x <= 100);
      expect(bst.size()).toBe(100);
      expect(bst.max()).toBe(100);
      expect(bst.min()).toBe(1);

      // should delete > 75
      bst.filter((x) => x <= 75);
      expect(bst.size()).toBe(75);
      expect(bst.max()).toBe(75);
      expect(bst.min()).toBe(1);
   });

   test("should clear the tree", () => {
      bst.insert(10);
      bst.insert(20);
      bst.clear();
      expect(bst.isEmpty()).toBeTruthy();
   });

   test("should create a tree from an array", () => {
      const array = [30, 10, 20, 40, 50];
      const tree = BinarySearchTree.fromArray(array);
      expect(tree.size()).toBe(array.length);
      expect(tree.min()).toBe(10);
      expect(tree.max()).toBe(50);
      expect(tree.toArray()).not.toEqual(array); // order isn't equal
      expect(tree.toArray()).toEqual(array.sort((a, b) => a - b));
   });

   test("should create a tree from a sorted array", () => {
      const sortedArray = [10, 20, 30, 40, 50];
      const tree = BinarySearchTree.fromSortedArray(sortedArray);
      expect(tree.size()).toBe(sortedArray.length);
      expect(tree.min()).toBe(10);
      expect(tree.max()).toBe(50);
      expect(tree.toArray()).toEqual(sortedArray);
   });

   test("should handle duplicate values", () => {
      bst.insert(10);
      bst.insert(10);
      bst.insert(10);
      expect(bst.size()).toBe(3);
      expect(bst.min()).toBe(10);
   });

   test("should maintain balance after multiple operations", () => {
      const values = [50, 30, 20, 40, 70, 60, 80];
      values.forEach((value) => bst.insert(value));
      expect(bst.height()).toBe(3);
      bst.delete(20);
      expect(bst.height()).toBe(3);
      bst.delete(30);
      expect(bst.height()).toBe(3);
      bst.delete(50);
      expect(bst.height()).toBe(3);
   });

   test("should return undefined for min and max on an empty tree", () => {
      expect(bst.min()).toBeUndefined();
      expect(bst.max()).toBeUndefined();
   });

   test("should handle deleting from an empty tree", () => {
      expect(bst.delete(10)).toBeUndefined;
      expect(bst.size()).toBe(0);
   });

   test("should delete the root and balance the tree", () => {
      bst.insert(30);
      bst.insert(20);
      bst.insert(40);
      bst.insert(10);
      bst.insert(25);

      bst.delete(30); // Deleting root
      expect(bst.size()).toBe(4);
      expect(bst.min()).toBe(10);
      expect(bst.max()).toBe(40);
   });

   test("should correctly return the height of a single-node tree", () => {
      bst.insert(10);
      expect(bst.height()).toBe(1);
   });

   test("should maintain size when inserting and deleting duplicate values", () => {
      bst.insert(10);
      bst.insert(10);
      bst.insert(10);
      expect(bst.size()).toBe(3);

      bst.delete(10);
      expect(bst.size()).toBe(2);
   });

   test("should handle large dataset efficiently", () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
      largeDataset.forEach((value) => bst.insert(value));
      expect(bst.size()).toBe(1000);
      expect(bst.min()).toBe(1);
      expect(bst.max()).toBe(1000);
   });
});

describe("BinarySearchTree with Custom Comparator", () => {
   let bst: BinarySearchTree<number>;

   beforeEach(() => {
      bst = new BinarySearchTree((a: number, b: number) => b - a);
   });

   test("should insert values and maintain custom order (descending)", () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);

      expect(bst.size()).toBe(3);
      expect(bst.min()).toBe(30);
      expect(bst.max()).toBe(10);
   });

   test("should maintain balance with custom comparator", () => {
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      expect(bst.size()).toBe(3);
      expect(bst.min()).toBe(70);
      expect(bst.max()).toBe(30);
   });

   test("should correctly delete values with custom comparator", () => {
      bst.insert(40);
      bst.insert(20);
      bst.insert(60);
      bst.delete(40);
      expect(bst.size()).toBe(2);
      expect(bst.max()).toBe(20);
      expect(bst.min()).toBe(60);
   });

   test("should handle complex objects with custom comparator", () => {
      const comparator = (a: { key: number }, b: { key: number }) =>
         a.key - b.key;
      const objectTree = new BinarySearchTree(comparator);

      objectTree.insert({ key: 5 });
      objectTree.insert({ key: 10 });
      objectTree.insert({ key: 1 });

      expect(objectTree.size()).toBe(3);
      expect(objectTree.min()).toEqual({ key: 1 });
      expect(objectTree.max()).toEqual({ key: 10 });
   });
});

describe("BinarySearchTree Cloning", () => {
   let tree: BinarySearchTree<number>;

   beforeEach(() => {
      tree = new BinarySearchTree<number>();
      [10, 20, 30, 5, 3].forEach((value) => tree.insert(value));
   });

   test("should clone the tree with the same values", () => {
      const clonedTree = tree.clone();
      expect([...clonedTree]).toEqual([...tree]);
   });

   test("should not be the same instance", () => {
      const clonedTree = tree.clone();
      expect(clonedTree).not.toBe(tree);
   });

   test("should not affect the cloned tree when modifying the original tree", () => {
      const clonedTree = tree.clone();
      tree.delete(10);
      expect([...clonedTree]).toEqual([3, 5, 10, 20, 30]);
   });

   test("should handle cloning an empty tree", () => {
      const emptyTree = new BinarySearchTree<number>();
      const clonedEmptyTree = emptyTree.clone();
      expect(clonedEmptyTree.isEmpty()).toBe(true);
   });
});
