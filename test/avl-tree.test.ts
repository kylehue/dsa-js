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

      expect(avlTree.delete(30)).toBeTruthy();
      expect(avlTree.height()).toBe(2);
      expect(avlTree.size()).toBe(2);
      expect(avlTree.min()).toBe(10);
      expect(avlTree.max()).toBe(20);

      expect(avlTree.delete(10)).toBeTruthy();
      expect(avlTree.height()).toBe(1);
      expect(avlTree.size()).toBe(1);
      expect(avlTree.min()).toBe(20);
      expect(avlTree.max()).toBe(20);

      expect(avlTree.delete(1234)).toBeFalsy();
      expect(avlTree.delete(10)).toBeFalsy();
      expect(avlTree.delete(30)).toBeFalsy();
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

   test("should clear the tree", () => {
      avlTree.insert(10);
      avlTree.insert(20);
      avlTree.clear();
      expect(avlTree.isEmpty()).toBeTruthy();
   });

   test("should traverse the tree (left)", () => {
      //       4
      //     /   \
      //    2     6
      //   / \   / \
      //  1   3 5   7
      avlTree.insert(1);
      avlTree.insert(2);
      avlTree.insert(3);
      avlTree.insert(4);
      avlTree.insert(5);
      avlTree.insert(6);
      avlTree.insert(7);

      // test left
      let values: number[] = [];
      avlTree.traverse((value) => {
         values.push(value);
         return "left";
      });
      expect(values.sort()).toEqual([1, 2, 4].sort());

      // test right
      values = [];
      avlTree.traverse((value) => {
         values.push(value);
         return "right";
      });
      expect(values.sort()).toEqual([4, 6, 7].sort());

      // test both
      values = [];
      avlTree.traverse((value) => {
         values.push(value);
         return "both";
      });
      expect(values.sort()).toEqual([1, 2, 3, 4, 5, 6, 7].sort());
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
      expect(avlTree.delete(10)).toBe(false);
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

   test("should maintain size when inserting and deleting duplicate values", () => {
      avlTree.insert(10);
      avlTree.insert(10);
      avlTree.insert(10);
      expect(avlTree.size()).toBe(3);

      avlTree.delete(10);
      expect(avlTree.size()).toBe(2);
   });

   test("should not crash when traversing an empty tree", () => {
      let values: number[] = [];
      avlTree.traverse((value) => {
         values.push(value);
         return "both";
      });
      expect(values).toEqual([]);
   });

   test("should handle large dataset efficiently", () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
      largeDataset.forEach((value) => avlTree.insert(value));
      expect(avlTree.size()).toBe(1000);
      expect(avlTree.min()).toBe(1);
      expect(avlTree.max()).toBe(1000);
   });
});
