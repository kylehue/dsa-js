import { describe, beforeEach, test, expect } from "vitest";
import { AVLTree } from "../src";

describe("AVLTree", () => {
   let avlTree: AVLTree;

   beforeEach(() => {
      avlTree = new AVLTree();
   });

   test("should initialize an empty AVL tree", () => {
      expect(avlTree.isEmpty()).toBe(true);
      expect(avlTree.size()).toBe(0);
      expect(avlTree.height()).toBe(0);
   });

   test("should insert values and maintain the correct size", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(30);
      expect(avlTree.size()).toBe(3);
      expect(avlTree.height()).toBe(2);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(30);
   });

   test("should maintain balance after insertions", () => {
      avlTree.insert(30);
      avlTree.insert(20);
      avlTree.insert(10);
      expect(avlTree.size()).toBe(3);
      expect(avlTree.height()).toBe(2);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(30);
   });

   test("should delete a leaf node", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(30);
      expect(avlTree.height()).toBe(2);
      expect(avlTree.size()).toBe(3);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(30);

      expect(avlTree.delete(30)).toBeFalsy(); // 30 has no successor
      expect(avlTree.height()).toBe(2);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(20);

      expect(avlTree.delete(10)).toBeFalsy(); // 10 has no successor
      expect(avlTree.height()).toBe(1);
      expect(avlTree.size()).toBe(1);
      expect(avlTree.min()).toBe(20);
      expect(avlTree.max()).toBe(20);

      expect(avlTree.delete(1234)).toBeFalsy();
      expect(avlTree.delete(10)).toBeFalsy();
      expect(avlTree.delete(30)).toBeFalsy();
   });

   test("should pass successor after deletion", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(15);
      expect(avlTree.delete(15)?.value()).toBe(20);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.max()).toBe(20);
   });

   test("should delete a node with one child", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(15);
      avlTree.delete(20);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.max()).toBe(15);
   });

   test("should delete a node with two children", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(15);
      avlTree.delete(10);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.min()).toBe(15);
   });

   test("should delete properly", () => {
      avlTree.insert(1);
      avlTree.insert(2);
      avlTree.insert(3);
      avlTree.insert(4);
      avlTree.insert(5);
      avlTree.insert(6);
      avlTree.insert(7);
      expect(avlTree.size()).toBe(7);

      avlTree.delete(4);
      avlTree.delete(5);
      avlTree.delete(6);
      avlTree.delete(7);

      expect(avlTree.size()).toBe(3);
      expect(avlTree.root()!.value()).toBe(2);
      expect(avlTree.root()!.left()!.value()).toBe(1);
      expect(avlTree.root()!.right()!.value()).toBe(3);
   });

   test.todo("should filter", () => {
      for (let i = 1; i <= 100; i++) {
         avlTree.insert(i);
      }
      expect(avlTree.size()).toBe(100);
      expect(avlTree.max()).toBe(100);
      expect(avlTree.min()).toBe(1);

      // should not delete any
      avlTree.filter((x) => x <= 100);
      expect(avlTree.size()).toBe(100);
      expect(avlTree.max()).toBe(100);
      expect(avlTree.min()).toBe(1);

      // should delete > 75
      avlTree.filter((x) => x <= 75);
      expect(avlTree.size()).toBe(75);
      expect(avlTree.max()).toBe(75);
      expect(avlTree.min()).toBe(1);
   });

   test("should clear the tree", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.clear();
      expect(avlTree.isEmpty()).toBeTruthy();
   });

   test("should rebuild the tree from a sorted array", () => {
      avlTree.insert(30);
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.rebuild();
      expect(avlTree.size()).toBe(3);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(30);
   });

   test("should create a tree from an array", () => {
      const array = [30, 10, 20, 40, 50];
      const tree = AVLTree.fromArray(array);
      expect(tree.size()).toBe(array.length);
      expect(tree.min()).toBe(10);
      expect(tree.max()).toBe(50);
      expect(tree.toArray()).not.toEqual(array); // order isn't equal
      expect(tree.toArray()).toEqual(array.sort((a, b) => a - b));
   });

   test("should create a tree from a sorted array", () => {
      const sortedArray = [10, 20, 30, 40, 50];
      const tree = AVLTree.fromSortedArray(sortedArray);
      expect(tree.size()).toBe(sortedArray.length);
      expect(tree.min()).toBe(10);
      expect(tree.max()).toBe(50);
      expect(tree.toArray()).toEqual(sortedArray);
   });

   test("should handle duplicate values", () => {
      avlTree.insert(10);
      avlTree.insert(10);
      avlTree.insert(10);
      expect(avlTree.size()).toBe(3);
      expect(avlTree.min()).toBe(10);
   });

   test("should maintain balance after multiple operations", () => {
      const values = [50, 30, 20, 40, 70, 60, 80];
      values.forEach((value) => avlTree.insert(value));
      expect(avlTree.height()).toBe(3);
      avlTree.delete(20);
      expect(avlTree.height()).toBe(3);
      avlTree.delete(30);
      expect(avlTree.height()).toBe(3);
      avlTree.delete(50);
      expect(avlTree.height()).toBe(3);
   });

   test("should return undefined for min and max on an empty tree", () => {
      expect(avlTree.min()).toBeUndefined();
      expect(avlTree.max()).toBeUndefined();
   });

   test("should handle deleting from an empty tree", () => {
      expect(avlTree.delete(10)).toBeUndefined;
      expect(avlTree.size()).toBe(0);
   });

   test("should delete the root and balance the tree", () => {
      avlTree.insert(30);
      avlTree.insert(20);
      avlTree.insert(40);
      avlTree.insert(10);
      avlTree.insert(25);

      avlTree.delete(30); // Deleting root
      expect(avlTree.size()).toBe(4);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(40);
   });

   test("should correctly return the height of a single-node tree", () => {
      avlTree.insert(10);
      expect(avlTree.height()).toBe(1);
   });

   test.todo(
      "should maintain size when inserting and deleting duplicate values",
      () => {
         avlTree.insert(10);
         avlTree.insert(10);
         avlTree.insert(10);
         expect(avlTree.size()).toBe(3);

         avlTree.delete(10);
         expect(avlTree.size()).toBe(2);
      }
   );

   test("should handle large dataset efficiently", () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
      largeDataset.forEach((value) => avlTree.insert(value));
      expect(avlTree.size()).toBe(1000);
      expect(avlTree.min()).toBe(1);
      expect(avlTree.max()).toBe(1000);
   });
});

describe("AVLTree with Custom Comparator", () => {
   let avlTree: AVLTree<number>;

   beforeEach(() => {
      avlTree = new AVLTree((a: number, b: number) => b - a);
   });

   test("should insert values and maintain custom order (descending)", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.insert(30);

      expect(avlTree.size()).toBe(3);
      expect(avlTree.min()).toBe(30);
      expect(avlTree.max()).toBe(10);
   });

   test("should maintain balance with custom comparator", () => {
      avlTree.insert(50);
      avlTree.insert(30);
      avlTree.insert(70);
      expect(avlTree.size()).toBe(3);
      expect(avlTree.min()).toBe(70);
      expect(avlTree.max()).toBe(30);
   });

   test("should correctly delete values with custom comparator", () => {
      avlTree.insert(40);
      avlTree.insert(20);
      avlTree.insert(60);
      avlTree.delete(40);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.max()).toBe(20);
      expect(avlTree.min()).toBe(60);
   });

   test("should handle complex objects with custom comparator", () => {
      const comparator = (a: { key: number }, b: { key: number }) =>
         a.key - b.key;
      const objectTree = new AVLTree(comparator);

      objectTree.insert({ key: 5 });
      objectTree.insert({ key: 10 });
      objectTree.insert({ key: 1 });

      expect(objectTree.size()).toBe(3);
      expect(objectTree.min()).toEqual({ key: 1 });
      expect(objectTree.max()).toEqual({ key: 10 });
   });
});

describe("AVLTree Cloning", () => {
   let tree: AVLTree<number>;

   beforeEach(() => {
      tree = new AVLTree<number>();
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
      const emptyTree = new AVLTree<number>();
      const clonedEmptyTree = emptyTree.clone();
      expect(clonedEmptyTree.isEmpty()).toBe(true);
   });
});
