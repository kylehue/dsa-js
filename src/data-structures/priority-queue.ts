import { Comparator } from "@/utils/comparator";
import { Heap } from "./heap";

export class PriorityQueue<T> {
   private _heap: Heap<T> = new Heap();

   constructor(comparator?: Comparator<T>) {
      this._heap = new Heap(comparator);
   }

   enqueue = this._heap.push.bind(this._heap);
   dequeue = this._heap.pop.bind(this._heap);
   front = this._heap.peek.bind(this._heap);
   size = this._heap.size.bind(this._heap);
   isEmpty = this._heap.isEmpty.bind(this._heap);
   clear = this._heap.clear.bind(this._heap);
   toArray = this._heap.toArray.bind(this._heap);
   clone = this._heap.clone.bind(this._heap);
}
