import { Comparator } from "@/utils/comparator";
import { Heap } from "./heap";

export class PriorityQueue<T> {
   private _heap: Heap<T>;

   constructor(comparator?: Comparator<T>) {
      this._heap = new Heap(comparator);
   }

   /**
    * Adds elements to the priority queue.
    *
    * @param items The elements to add to the priority queue.
    */
   enqueue(...items: T[]) {
      this._heap.push(...items);
   }

   /**
    * Removes the top element from the priority queue and returns it.
    *
    * @returns The top element of the priority queue.
    */
   dequeue() {
      return this._heap.pop();
   }

   /**
    * Returns the top element of the priority queue without removing it.
    *
    * @returns The top element of the priority queue.
    */
   front() {
      return this._heap.peek();
   }

   /**
    * Returns the number of elements in the priority queue.
    *
    * @returns The number of elements in the priority queue.
    */
   size() {
      return this._heap.size();
   }

   /**
    * Returns true if the priority queue is empty, false otherwise.
    */
   isEmpty() {
      return this._heap.isEmpty();
   }

   /**
    * Removes all elements from the priority queue.
    */
   clear() {
      this._heap.clear();
   }

   /**
    * Returns the elements of the priority queue as an array.
    */
   toArray() {
      return this._heap.toArray();
   }

   /**
    * Returns a clone of the priority queue.
    */
   clone() {
      return this._heap.clone();
   }

   /**
    * Builds a priority queue from the given array.
    *
    * @param {T[]} array The array to build the priority queue from.
    * @param {Comparator<T>} comparator The comparator function to use.
    * (Optional)
    *
    * @returns {PriorityQueue<T>} The priority queue built from the given array.
    */
   static fromArray<T>(array: T[], comparator?: Comparator<T>) {
      const priorityQueue = new PriorityQueue(comparator);
      priorityQueue._heap = Heap.fromArray(array);
      return priorityQueue;
   }
}
