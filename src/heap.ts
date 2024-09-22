import { swap } from "@/utils/common";
import { Comparator, defaultComparator } from "@/utils/comparator";

export class Heap<T = number> {
   private _heap: T[] = [];
   private _comparator: Comparator<T> = defaultComparator;

   /**
    * Creates a new instance of Heap.
    *
    * @param comparator The comparator function to use. (Optional)
    */
   constructor(comparator?: Comparator<T>) {
      if (comparator) this._comparator = comparator;
   }

   /**
    * Returns the number of elements in the heap.
    *
    * @timeComplexity `O(1)`
    */
   size(): number {
      return this._heap.length;
   }

   /**
    * Returns true if the heap is empty, false otherwise.
    *
    * @timeComplexity `O(1)`
    */
   isEmpty(): boolean {
      return this.size() === 0;
   }

   /**
    * Returns the top element of the heap without removing it.
    *
    * @timeComplexity `O(1)`
    *
    * @returns Returns the top element of the heap or undefined if
    * the heap is empty.
    */
   peek(): T | void {
      return this.isEmpty() ? undefined : this._heap[0];
   }

   /**
    * Adds elements to the heap.
    *
    * @timeComplexity `O(k * log(n))` where `k` is the number of items to add.
    *
    * @param items The elements to add to the heap.
    */
   push(...items: T[]): void {
      for (const item of items) {
         this._heap.push(item);
         this._heapifyUp(this.size() - 1);
      }
   }

   /**
    * Removes the top element from the heap and returns it.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns The top element of the heap or undefined if
    * the heap is empty.
    */
   pop(): T | undefined {
      if (this.isEmpty()) return;
      if (this.size() === 1) return this._heap.pop() as T;

      const removedValue = this._heap[0];
      this._heap[0] = this._heap.pop() as T;
      this._heapifyDown(0);
      return removedValue;
   }

   /**
    * Clears the heap.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._heap = [];
   }

   /**
    * Clones the heap.
    *
    * @timeComplexity `O(n)`
    */
   clone(): Heap<T> {
      const clonedHeap = new Heap<T>(this._comparator);
      clonedHeap._heap = [...this._heap];
      return clonedHeap;
   }

   /**
    * Converts the heap to a sorted array.
    *
    * @timeComplexity `O(n * log(n))`
    */
   toArray(): T[] {
      const clone = this.clone();
      const result: T[] = [];
      while (!clone.isEmpty()) {
         result.push(clone.pop() as T);
      }

      return result;
   }

   /**
    * Builds a heap from the given array.
    *
    * @param array The array to build the heap from.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n * log(n))`
    *
    * @returns The heap built from the given array.
    */
   static fromArray<T>(array: T[], comparator?: Comparator<T>): Heap<T> {
      const heap = new Heap<T>(comparator);
      heap._heap = [...array];
      for (let i = heap.size() - 1; i >= 0; i--) {
         heap._heapifyDown(i);
      }
      return heap;
   }

   /**
    * Moves the element at the given index down the heap to its
    * correct position.
    *
    * @param index The index of the element to move down.
    */
   private _heapifyDown(index: number): void {
      let currentIndex = index;
      while (this._getLeftChildIndex(currentIndex) < this.size()) {
         let smallestChildIndex = this._getLeftChildIndex(currentIndex);
         if (
            this._getRightChildIndex(currentIndex) < this.size() &&
            this._comparator(
               this._heap[this._getLeftChildIndex(currentIndex)],
               this._heap[this._getRightChildIndex(currentIndex)]
            ) > 0
         ) {
            smallestChildIndex = this._getRightChildIndex(currentIndex);
         }
         if (
            this._comparator(
               this._heap[currentIndex],
               this._heap[smallestChildIndex]
            ) > 0
         ) {
            swap(this._heap, currentIndex, smallestChildIndex);
            currentIndex = smallestChildIndex;
         } else {
            break;
         }
      }
   }

   /**
    * Moves the element at the given index up the heap to its correct position.
    *
    * @param index The index of the element to move up.
    */
   private _heapifyUp(index: number): void {
      let currentIndex = index;
      while (
         this._getParentIndex(currentIndex) >= 0 &&
         this._comparator(
            this._heap[currentIndex],
            this._heap[this._getParentIndex(currentIndex)]
         ) < 0
      ) {
         const parentIndex = this._getParentIndex(currentIndex);
         swap(this._heap, currentIndex, parentIndex);
         currentIndex = parentIndex;
      }
   }

   private _getParentIndex(index: number): number {
      return (index - 1) >> 1;
   }

   private _getLeftChildIndex(index: number): number {
      return (index << 1) + 1;
   }

   private _getRightChildIndex(index: number): number {
      return (index << 1) + 2;
   }
}
