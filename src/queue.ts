import { LinkedList } from "./linked-list";

export class Queue<T = any> {
   protected _list: LinkedList<T> = new LinkedList();

   /**
    * Adds a value to the end of the queue.
    *
    * @param value The value to add to the queue.
    *
    * @timeComplexity `O(1)`
    */
   enqueue(value: T): void {
      this._list.append(value);
   }

   /**
    * Removes and returns the value at the front of the queue.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The value at the front of the queue or undefined if the queue
    * is empty.
    */
   dequeue(): T | void {
      const head = this._list.head();
      if (head) {
         this._list.deleteNode(head);
         return head.value;
      }
   }

   /**
    * Returns the value at the front of the queue without removing it.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The value at the front of the queue or undefined if the queue
    * is empty.
    */
   front(): T | void {
      return this._list.head()?.value;
   }

   /**
    * Returns the value at the back of the queue without removing it.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The value at the back of the queue or undefined if the queue
    * is empty.
    */
   back(): T | undefined {
      return this._list.tail()?.value;
   }

   /**
    * Returns the number of elements in the queue.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The number of elements in the queue.
    */
   size(): number {
      return this._list.size();
   }

   /**
    * Returns true if the queue is empty, false otherwise.
    *
    * @timeComplexity `O(1)`
    *
    * @returns True if the queue is empty, false otherwise.
    */
   isEmpty(): boolean {
      return this._list.isEmpty();
   }

   /**
    * Removes all elements from the queue.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._list.clear();
   }

   /**
    * Creates a copy of the queue.
    *
    * @timeComplexity `O(n)`
    */
   clone(): Queue<T> {
      const queue = new Queue<T>();
      queue._list = this._list.clone();
      return queue;
   }

   /**
    * Converts the queue to an array.
    *
    * @timeComplexity `O(n)`
    *
    * @returns An array containing all the values in the queue.
    */
   toArray(): T[] {
      return [...this.values()];
   }

   /**
    * Creates a queue from an array of values.
    *
    * @timeComplexity `O(n)`
    */
   static fromArray<T>(array: T[]): Queue<T> {
      const queue = new Queue<T>();
      for (const value of array) {
         queue.enqueue(value);
      }
      return queue;
   }

   *values(): IterableIterator<T> {
      let current = this._list.head();
      while (current !== undefined) {
         yield current.value;
         current = current.next();
      }
   }

   *[Symbol.iterator](): IterableIterator<T> {
      yield* this.values();
   }
}
