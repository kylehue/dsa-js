export class ListNode<T> {
   public value: T;
   private readonly _next: ListNode<T> | undefined = undefined;
   private readonly _prev: ListNode<T> | undefined = undefined;
   private readonly _isDisposed = false;

   constructor(value: T) {
      this.value = value;
   }

   next(): ListNode<T> | undefined {
      return this._next;
   }

   prev(): ListNode<T> | undefined {
      return this._prev;
   }

   isDisposed(): boolean {
      return this._isDisposed;
   }
}

/**
 * Represents a doubly linked list.
 */
export class LinkedList<T> implements Iterable<ListNode<T>> {
   private _head: ListNode<T> | undefined = undefined;
   private _tail: ListNode<T> | undefined = undefined;
   private _size: number = 0;

   /**
    * Adds a node with the specified value to the end of the list.
    *
    * @param value The value of the node to add.
    *
    * @returns The newly added node.
    */
   append(value: T): ListNode<T> {
      const newNode = new ListNode(value);
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
    * Adds a node with the specified value to the end of the list.
    *
    * @param value The value of the node to add.
    *
    * @returns The newly added node.
    */
   prepend(value: T): ListNode<T> {
      if (this._head) {
         return this.insertBefore(this._head, value);
      } else {
         return this.append(value);
      }
   }

   /**
    * Removes a node from the list.
    *
    * @param node The node to remove.
    *
    * @returns True if the node is deleted, otherwise false.
    */
   deleteNode(node: ListNode<T>): boolean {
      if (this._head === undefined) return false;
      if (node.isDisposed()) return false;

      if (this._head === node) {
         this._head = this._head.next();
         if (this._head !== undefined) {
            changePrev(this._head, undefined);
         } else {
            this._tail = undefined;
         }
         disposeNode(node);
         this._size--;
         return true;
      } else if (this._tail === node) {
         this._tail = this._tail.prev();
         if (this._tail !== undefined) {
            changeNext(this._tail, undefined);
         } else {
            this._head = undefined;
         }
         disposeNode(node);
         this._size--;
         return true;
      } else {
         let next = node.next();
         let prev = node.prev();
         if (
            next !== undefined &&
            prev !== undefined &&
            prev.next() === node &&
            next.prev() === node
         ) {
            changePrev(next, node.prev());
            changeNext(prev, node.next());
            disposeNode(node);
            this._size--;
            return true;
         }

         return false;
      }
   }

   /**
    * Adds a node with the specified value after a given node.
    *
    * @param afterNode The node after which the new node should be added.
    * @param value The value of the new node.
    *
    * @returns The newly added node.
    */
   insertAfter(afterNode: ListNode<T>, value: T): ListNode<T> {
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
   insertBefore(beforeNode: ListNode<T>, value: T): ListNode<T> {
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
    * @returns The node with the specified value or undefined if not found.
    */
   find(value: T): ListNode<T> | void {
      for (let node of this) {
         if (node.value === value) {
            return node;
         }
      }
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
    *
    * Note: For efficiency, this doesn't delete nodes one by one.
    * Avoid reusing the old nodes to avoid unexpected behaviors.
    */
   clear(): void {
      this._head = undefined;
      this._tail = undefined;
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
    * @returns The head node or undefined if the list is empty.
    */
   head(): ListNode<T> | undefined {
      return this._head;
   }

   /**
    * Returns the tail node of the list.
    *
    * @returns The tail node or undefined if the list is empty.
    */
   tail(): ListNode<T> | undefined {
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

   *values(): IterableIterator<ListNode<T>> {
      let current = this.head();
      while (current !== undefined) {
         yield current;
         current = current.next();
      }
   }

   *[Symbol.iterator](): IterableIterator<ListNode<T>> {
      let current = this._head;
      while (current !== undefined) {
         yield current;
         current = current.next();
      }
   }
}

/*
 * Helper functions to change the next and previous nodes of a list node
 * without making typescript angry.
 */

function changeNext<T>(node: ListNode<T>, next: ListNode<T> | undefined) {
   // @ts-ignore
   node._next = next;
}

function changePrev<T>(node: ListNode<T>, prev: ListNode<T> | undefined) {
   // @ts-ignore
   node._prev = prev;
}

function disposeNode<T>(node: ListNode<T>) {
   // @ts-ignore
   node._isDisposed = true;
   // @ts-ignore
   node._prev = undefined;
   // @ts-ignore
   node._next = undefined;
}
