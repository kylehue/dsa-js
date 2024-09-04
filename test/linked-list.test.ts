import { describe, it, expect, beforeEach } from "vitest";
import { LinkedList } from "../src";

describe("LinkedList", () => {
   let list: LinkedList<number>;

   beforeEach(() => {
      list = new LinkedList<number>();
      list.append(1); // Node with value 1
      list.append(2); // Node with value 2
      list.append(3); // Node with value 3
   });

   it("should add nodes correctly", () => {
      const head = list.head();
      const tail = list.tail();
      expect(head?.value).toBe(1);
      expect(tail?.value).toBe(3);
      expect(head?.next()?.value).toBe(2);
      expect(tail?.prev()?.value).toBe(2);
   });

   it("should remove the head node correctly", () => {
      const head = list.head();
      if (head) {
         list.deleteNode(head);
      }
      const newHead = list.head();
      const tail = list.tail();
      expect(newHead?.value).toBe(2);
      expect(tail?.value).toBe(3);
      expect(newHead?.prev()).toBe(null);
   });

   it("should only remove nodes that exists in the list", () => {
      let randomNode = LinkedList.createNode(2);
      list.deleteNode(randomNode);
      expect(list.size()).toBe(3);

      let head = list.head()!;
      list.deleteNode(head);
      expect(list.size()).toBe(2);

      list.deleteNode(head);
      expect(list.size()).toBe(2);
   });

   it("should remove the tail node correctly", () => {
      const tail = list.tail();
      if (tail) {
         list.deleteNode(tail);
      }
      const newTail = list.tail();
      const head = list.head();
      expect(newTail?.value).toBe(2);
      expect(head?.value).toBe(1);
      expect(newTail?.next()).toBe(null);
   });

   it("should remove a middle node correctly", () => {
      const head = list.head();
      const secondNode = head?.next(); // Node with value 2
      if (secondNode) {
         list.deleteNode(secondNode);
      }
      const newHead = list.head();
      const tail = list.tail();
      expect(newHead?.value).toBe(1);
      expect(tail?.value).toBe(3);
      expect(newHead?.next()?.value).toBe(3);
      expect(tail?.prev()?.value).toBe(1);
   });

   it("should add a node after a given node correctly", () => {
      const head = list.head();
      const newNode = list.appendAfter(head!, 4);
      expect(newNode.value).toBe(4);
      expect(head?.next()?.value).toBe(4);
      expect(newNode.next()?.value).toBe(2);
      expect(list.tail()?.value).toBe(3);
   });

   it("should add a node before a given node correctly", () => {
      const tail = list.tail();
      const newNode = list.appendBefore(tail!, 5);
      expect(newNode.value).toBe(5);
      expect(tail?.prev()?.value).toBe(5);
      expect(newNode.next()?.value).toBe(3);
      expect(list.tail()?.value).toBe(3);
   });

   it("should find a node by value correctly", () => {
      const foundNode = list.find(2);
      expect(foundNode?.value).toBe(2);
      expect(list.find(100)).toBe(null);
   });

   it("should clone the linked list correctly", () => {
      const clone = list.clone();
      expect(clone.toArray()).toEqual([1, 2, 3]);
   });

   it("should convert the linked list to an array correctly", () => {
      expect(list.toArray()).toEqual([1, 2, 3]);
   });

   it("should clear the linked list correctly", () => {
      list.clear();
      expect(list.toArray()).toEqual([]);
   });

   it("should create linked list from an array correctly", () => {
      const array = [1, 2, 3];
      const linkedList = LinkedList.fromArray(array);
      expect(linkedList.toArray()).toEqual(array);
   });

   it("should properly return size of the linked list", () => {
      expect(list.size()).toBe(3);
      expect(list.isEmpty()).toBe(false);
      list.deleteNode(list.head()!);
      expect(list.size()).toBe(2);
      expect(list.isEmpty()).toBe(false);
      list.clear();
      expect(list.size()).toBe(0);
      expect(list.isEmpty()).toBe(true);
   });
});

describe("LinkedList - Empty", () => {
   let list: LinkedList<number>;

   beforeEach(() => {
      list = new LinkedList<number>();
   });

   it("should handle adding and removing a single node", () => {
      const node = list.append(1);
      expect(list.head()?.value).toBe(1);
      expect(list.tail()?.value).toBe(1);

      list.deleteNode(node);
      expect(list.head()).toBe(null);
      expect(list.tail()).toBe(null);
   });

   it("should handle adding a node to an empty list", () => {
      const node = list.append(1);
      expect(list.head()?.value).toBe(1);
      expect(list.tail()?.value).toBe(1);
   });

   it("should handle adding a node before and after the head and tail nodes", () => {
      const node1 = list.append(1); // Head
      const node2 = list.append(2); // Tail

      const newNodeBeforeHead = list.appendBefore(node1, 0);
      expect(newNodeBeforeHead.value).toBe(0);
      expect(list.head()?.value).toBe(0);

      const newNodeAfterTail = list.appendAfter(node2, 3);
      expect(newNodeAfterTail.value).toBe(3);
      expect(list.tail()?.value).toBe(3);
   });

   it("should handle adding multiple nodes correctly", () => {
      const node1 = list.append(1);
      const node2 = list.append(2);
      const node3 = list.append(3);

      expect(list.head()?.value).toBe(1);
      expect(list.tail()?.value).toBe(3);

      expect(node1.next()?.value).toBe(2);
      expect(node2.next()?.value).toBe(3);
      expect(node3.prev()?.value).toBe(2);
   });

   it("should handle cloning an empty list", () => {
      const clone = list.clone();
      expect(clone.toArray()).toEqual([]);
   });

   it("should handle cloning a non-empty list", () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const clone = list.clone();
      expect(clone.toArray()).toEqual([1, 2, 3]);
   });

   it("should handle iterating over an empty list", () => {
      const values: number[] = [];
      for (let node of list) {
         values.push(node.value);
      }
      expect(values).toEqual([]);
   });

   it("should handle iterating over a non-empty list", () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const values: number[] = [];
      for (let node of list) {
         values.push(node.value);
      }
      expect(values).toEqual([1, 2, 3]);
   });

   it("should handle adding a node after a node with null next", () => {
      const node1 = list.append(1);
      const node2 = list.append(2);
      const newNode = list.appendAfter(node1, 3);

      expect(newNode.value).toBe(3);
      expect(node1.next()?.value).toBe(3);
      expect(node2.prev()?.value).toBe(3);
      expect(list.tail()?.value).toBe(2);
   });

   it("should handle adding a node before a node with null prev", () => {
      const node1 = list.append(1);
      const node2 = list.append(2);
      const newNode = list.appendBefore(node2, 3);

      expect(newNode.value).toBe(3);
      expect(node2.prev()?.value).toBe(3);
      expect(list.head()?.value).toBe(1);
      expect(list.tail()?.value).toBe(2);
   });

   it("should handle edge cases in `findNode` method", () => {
      expect(list.find(10)).toBe(null);

      const node = list.append(1);
      expect(list.find(1)?.value).toBe(1);

      list.deleteNode(node);
      expect(list.find(1)).toBe(null);
   });
});
