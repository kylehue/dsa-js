class ListNode<T> {
   public value: T;
   private readonly _next: ListNode<T> | null = null;
   private readonly _prev: ListNode<T> | null = null;

   constructor(value: T) {
      this.value = value;
   }

   next(): ListNode<T> | null {
      return this._next;
   }

   prev(): ListNode<T> | null {
      return this._prev;
   }
}

/**
 * Represents a doubly linked list.
 */
export class LinkedList<T> implements Iterable<ListNode<T>> {
   private _head: ListNode<T> | null = null;
   private _tail: ListNode<T> | null = null;
   private _size: number = 0;

   static createNode<T>(value: T): ListNode<T> {
      return new ListNode(value);
   }

   /**
    * Adds a node with the specified value to the end of the list.
    *
    * @param value The value of the node to add.
    *
    * @returns The newly added node.
    */
   append(value: T) {
      const newNode = LinkedList.createNode(value);
      if (!this._head) {
         this._head = newNode;
         this._tail = newNode;
      } else {
         changeNext(this._tail!, newNode);
         changePrev(newNode, this._tail!);
         this._tail = newNode;
      }

      this._size++;

      return newNode;
   }

   /**
    * Removes a node from the list.
    *
    * @param node The node to remove.
    */
   deleteNode(node: ListNode<T>): void {
      if (this._head === null) return;

      if (this._head === node) {
         this._head = this._head.next();
         if (this._head !== null) {
            changePrev(this._head, null);
         } else {
            this._tail = null;
         }
      } else if (this._tail === node) {
         this._tail = this._tail.prev();
         if (this._tail !== null) {
            changeNext(this._tail, null);
         } else {
            this._head = null;
         }
      } else {
         let next = node.next();
         if (next !== null) {
            changePrev(next, node.prev());
         }
         let prev = node.prev();
         if (prev !== null) {
            changeNext(prev, node.next());
         }
      }

      this._size--;
   }

   /**
    * Adds a node with the specified value after a given node.
    *
    * @param afterNode The node after which the new node should be added.
    * @param value The value of the new node.
    *
    * @returns The newly added node.
    */
   appendAfter(afterNode: ListNode<T>, value: T) {
      const newNode = new ListNode(value);
      changeNext(newNode, afterNode.next());
      changePrev(newNode, afterNode);
      let afterNodeNext = afterNode.next();
      if (afterNodeNext) {
         changePrev(afterNodeNext, newNode);
      } else {
         this._tail = newNode;
      }
      changeNext(afterNode, newNode);

      this._size++;

      return newNode;
   }

   /**
    * Adds a node with the specified value before a given node.
    *
    * @param beforeNode The node before which the new node should be added.
    * @param value The value of the new node.
    *
    * @returns The newly added node.
    */
   appendBefore(beforeNode: ListNode<T>, value: T): ListNode<T> {
      const newNode = new ListNode(value);

      if (this._head === beforeNode) {
         changeNext(newNode, this._head);
         changePrev(this._head, newNode);
         this._head = newNode;
      } else {
         const prevNode = beforeNode.prev();
         if (prevNode) {
            changeNext(prevNode, newNode);
            changePrev(newNode, prevNode);
         }
         changeNext(newNode, beforeNode);
         changePrev(beforeNode, newNode);
      }

      this._size++;

      return newNode;
   }

   /**
    * Finds a node with a specific value.
    *
    * @param value The value of the node to find.
    * @returns The node with the specified value or null if not found.
    */
   find(value: T): ListNode<T> | null {
      for (let node of this) {
         if (node.value === value) {
            return node;
         }
      }
      return null;
   }

   /**
    * Clones the linked list.
    *
    * @returns A new linked list that is a clone of the current list.
    */
   clone(): LinkedList<T> {
      const cloneList = new LinkedList<T>();
      let current = this._head;
      while (current) {
         cloneList.append(current.value);
         current = current.next();
      }
      return cloneList;
   }

   /**
    * Removes all nodes from the list.
    */
   clear(): void {
      this._head = null;
      this._tail = null;
      this._size = 0;
   }

   /**
    * Returns the number of nodes in the list.
    */
   size(): number {
      return this._size;
   }

   /**
    * Returns whether the list is empty.
    */
   isEmpty(): boolean {
      return this._size === 0;
   }

   /**
    * Converts the linked list to an array.
    *
    * @returns An array containing all the values in the list.
    */
   toArray(): T[] {
      const result: T[] = [];
      let current = this._head;
      while (current) {
         result.push(current.value);
         current = current.next();
      }
      return result;
   }

   /**
    * Returns the head node of the list.
    *
    * @returns The head node or null if the list is empty.
    */
   head(): ListNode<T> | null {
      return this._head;
   }

   /**
    * Returns the tail node of the list.
    *
    * @returns The tail node or null if the list is empty.
    */
   tail(): ListNode<T> | null {
      return this._tail;
   }

   /**
    * Creates a linked list from an array of values.
    *
    * @param array The array of values to convert into a linked list.
    * @returns A new linked list containing the values from the array.
    */
   static fromArray<T>(array: T[]): LinkedList<T> {
      const list = new LinkedList<T>();
      for (const value of array) {
         list.append(value);
      }
      return list;
   }

   [Symbol.iterator](): Iterator<ListNode<T>> {
      let current = this._head;
      return {
         next(): IteratorResult<ListNode<T>> {
            if (current) {
               const value = current;
               current = current.next();
               return { value, done: false };
            }
            return { value: undefined as any, done: true };
         },
      };
   }
}

/*
 * Helper functions to change the next and previous nodes of a list node
 * without making typescript angry.
 */

function changeNext<T>(node: ListNode<T>, next: ListNode<T> | null) {
   // @ts-ignore
   node._next = next;
}

function changePrev<T>(node: ListNode<T>, prev: ListNode<T> | null) {
   // @ts-ignore
   node._prev = prev;
}
