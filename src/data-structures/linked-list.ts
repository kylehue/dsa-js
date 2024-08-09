class ListNode<T> {
   public value: T;
   private readonly _next: ListNode<T> | null = null;
   private readonly _prev: ListNode<T> | null = null;

   constructor(value: T) {
      this.value = value;
   }

   get next(): ListNode<T> | null {
      return this._next;
   }

   get prev(): ListNode<T> | null {
      return this._prev;
   }
}

/**
 * Represents a doubly linked list.
 */
export class LinkedList<T> implements Iterable<ListNode<T>> {
   private head: ListNode<T> | null = null;
   private tail: ListNode<T> | null = null;

   /**
    * Adds a node with the specified value to the end of the list.
    *
    * @param value The value of the node to add.
    *
    * @returns The newly added node.
    */
   addNode(value: T) {
      const newNode = new ListNode(value);
      if (!this.head) {
         this.head = newNode;
         this.tail = newNode;
      } else {
         changeNext(this.tail!, newNode);
         changePrev(newNode, this.tail!);
         this.tail = newNode;
      }

      return newNode;
   }

   /**
    * Removes a node from the list.
    *
    * @param node The node to remove.
    */
   removeNode(node: ListNode<T>): void {
      if (this.head === null) return;

      if (this.head === node) {
         this.head = this.head.next;
         if (this.head !== null) {
            changePrev(this.head, null);
         } else {
            this.tail = null;
         }
      } else if (this.tail === node) {
         this.tail = this.tail.prev;
         if (this.tail !== null) {
            changeNext(this.tail, null);
         } else {
            this.head = null;
         }
      } else {
         if (node.next !== null) {
            changePrev(node.next, node.prev);
         }
         if (node.prev !== null) {
            changeNext(node.prev, node.next);
         }
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
   addNodeAfter(afterNode: ListNode<T>, value: T) {
      const newNode = new ListNode(value);
      changeNext(newNode, afterNode.next);
      changePrev(newNode, afterNode);
      if (afterNode.next) {
         changePrev(afterNode.next, newNode);
      } else {
         this.tail = newNode;
      }
      changeNext(afterNode, newNode);

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
   addNodeBefore(beforeNode: ListNode<T>, value: T): ListNode<T> {
      const newNode = new ListNode(value);

      if (this.head === beforeNode) {
         changeNext(newNode, this.head);
         changePrev(this.head, newNode);
         this.head = newNode;
      } else {
         const prevNode = beforeNode.prev;
         if (prevNode) {
            changeNext(prevNode, newNode);
            changePrev(newNode, prevNode);
         }
         changeNext(newNode, beforeNode);
         changePrev(beforeNode, newNode);
      }

      return newNode;
   }

   /**
    * Finds a node with a specific value.
    *
    * @param value The value of the node to find.
    * @returns The node with the specified value or null if not found.
    */
   findNode(value: T): ListNode<T> | null {
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
      let current = this.head;
      while (current) {
         cloneList.addNode(current.value);
         current = current.next;
      }
      return cloneList;
   }

   /**
    * Removes all nodes from the list.
    */
   clear(): void {
      this.head = null;
      this.tail = null;
   }

   /**
    * Converts the linked list to an array.
    *
    * @returns An array containing all the values in the list.
    */
   toArray(): T[] {
      const result: T[] = [];
      let current = this.head;
      while (current) {
         result.push(current.value);
         current = current.next;
      }
      return result;
   }

   /**
    * Returns the head node of the list.
    *
    * @returns The head node or null if the list is empty.
    */
   getHead(): ListNode<T> | null {
      return this.head;
   }

   /**
    * Returns the tail node of the list.
    *
    * @returns The tail node or null if the list is empty.
    */
   getTail(): ListNode<T> | null {
      return this.tail;
   }

   [Symbol.iterator](): Iterator<ListNode<T>> {
      let current = this.head;
      return {
         next(): IteratorResult<ListNode<T>> {
            if (current) {
               const value = current;
               current = current.next;
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
