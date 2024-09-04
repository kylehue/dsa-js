import { Queue } from "./queue";

export class Deque<T> extends Queue<T> {
   /**
    * Adds a value to the front of the queue.
    * @param value The value to add to the front of the queue.
    */
   enqueueFront(value: T): void {
      let head = this._list.head();
      if (head) {
         this._list.appendBefore(head, value);
      } else {
         this._list.append(value);
      }
   }

   /**
    * Removes and returns the value at the back of the queue.
    * @returns The value at the front of the queue.
    */
   dequeueBack(): T | null {
      let tail = this._list.tail();
      if (tail) {
         let value = tail.value;
         this._list.deleteNode(tail);
         return value;
      }
      return null;
   }
}
