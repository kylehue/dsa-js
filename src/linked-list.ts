export class LinkedList<T = any> implements Iterable<ListNode<T>> {
   private _head: ListNode<T> | undefined = undefined;
   private _tail: ListNode<T> | undefined = undefined;
   private _size: number = 0;

   /**
    * Adds a node with the specified value to the end of the list.
    *
    * @param value The value of the node to add.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The newly added node.
    */
   append(value: T): ListNode<T> {
      const newNode = new ListNode(value);
      if (!this._head) {
         this._head = newNode;
         this._tail = newNode;
      } else {
         this._tail!.setNext(newNode);
         newNode.setPrev(this._tail!);
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
    * @timeComplexity `O(1)`
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
    * @timeComplexity `O(1)`
    *
    * @returns True if the node is deleted, otherwise false.
    */
   deleteNode(node: ListNode<T>): boolean {
      if (this._head === undefined) return false;
      if (node.isDisposed()) return false;

      if (this._head === node) {
         this._head = this._head.next();
         if (this._head !== undefined) {
            this._head.setPrev(undefined);
         } else {
            this._tail = undefined;
         }
         node.dispose();
         this._size--;
         return true;
      } else if (this._tail === node) {
         this._tail = this._tail.prev();
         if (this._tail !== undefined) {
            this._tail.setNext(undefined);
         } else {
            this._head = undefined;
         }
         node.dispose();
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
            next.setPrev(node.prev());
            prev.setNext(node.next());
            node.dispose();
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
    * @timeComplexity `O(1)`
    *
    * @returns The newly added node.
    */
   insertAfter(afterNode: ListNode<T>, value: T): ListNode<T> {
      const newNode = new ListNode(value);
      newNode.setNext(afterNode.next());
      newNode.setPrev(afterNode);
      let afterNodeNext = afterNode.next();
      if (afterNodeNext) {
         afterNodeNext.setPrev(newNode);
      } else {
         this._tail = newNode;
      }
      afterNode.setNext(newNode);

      this._size++;

      return newNode;
   }

   /**
    * Adds a node with the specified value before a given node.
    *
    * @param beforeNode The node before which the new node should be added.
    * @param value The value of the new node.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The newly added node.
    */
   insertBefore(beforeNode: ListNode<T>, value: T): ListNode<T> {
      const newNode = new ListNode(value);

      if (this._head === beforeNode) {
         newNode.setNext(this._head);
         this._head.setPrev(newNode);
         this._head = newNode;
      } else {
         const prevNode = beforeNode.prev();
         if (prevNode) {
            prevNode.setNext(newNode);
            newNode.setPrev(prevNode);
         }
         newNode.setNext(beforeNode);
         beforeNode.setPrev(newNode);
      }

      this._size++;

      return newNode;
   }

   /**
    * Finds a node with a specific value.
    *
    * @param value The value of the node to find.
    *
    * @timeComplexity `O(n)`
    *
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
    * @timeComplexity `O(n)`
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
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._head = undefined;
      this._tail = undefined;
      this._size = 0;
   }

   /**
    * Returns the number of nodes in the list.
    *
    * @timeComplexity `O(1)`
    */
   size(): number {
      return this._size;
   }

   /**
    * Returns whether the list is empty.
    *
    * @timeComplexity `O(1)`
    */
   isEmpty(): boolean {
      return this._size === 0;
   }

   /**
    * Converts the linked list to an array.
    *
    * @timeComplexity `O(n)`
    *
    * @returns An array containing all the values in the list.
    */
   toArray(): ListNode<T>[] {
      return [...this.values()];
   }

   /**
    * Returns the head node of the list.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The head node or undefined if the list is empty.
    */
   head(): ListNode<T> | undefined {
      return this._head;
   }

   /**
    * Returns the tail node of the list.
    *
    * @timeComplexity `O(1)`
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
    *
    * @timeComplexity `O(n)`
    *
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
      yield* this.values();
   }
}

export class ListNode<T> {
   public value: T;
   private _next: ListNode<T> | undefined = undefined;
   private _prev: ListNode<T> | undefined = undefined;
   private _isDisposed = false;

   constructor(value: T) {
      this.value = value;
   }

   /**
    * Get the node after this node.
    *
    * @timeComplexity `O(1)`
    *
    * @returns A node, or undefined if this node has no next node.
    */
   next(): ListNode<T> | undefined {
      return this._next;
   }

   /**
    * Get the node before this node.
    *
    * @timeComplexity `O(1)`
    *
    * @returns A node, or undefined if this node has no previous node.
    */
   prev(): ListNode<T> | undefined {
      return this._prev;
   }

   /**
    * Check if the node is already disposed.
    *
    * @timeComplexity `O(1)`
    *
    * @returns A boolean indicating whether the node is disposed or not.
    */
   isDisposed(): boolean {
      return this._isDisposed;
   }

   /**
    * Change the next node of this node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   setNext(next: ListNode<T> | undefined): void {
      this._next = next;
   }

   /**
    * Change the previous node of this node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   setPrev(prev: ListNode<T> | undefined): void {
      this._prev = prev;
   }

   /**
    * Dispose this node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   dispose(): void {
      this._isDisposed = true;
      this._prev = undefined;
      this._next = undefined;
   }
}
