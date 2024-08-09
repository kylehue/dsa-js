import { Queue } from "./queue";

export class Deque<T> extends Queue<T> {
   /**
    * Adds an element to the front of the deque.
    * @param element The element to add to the deque.
    */
   addFront(element: T): void {
      let head = this._list.getHead();
      if (head) {
         this._list.addNodeBefore(head, element);
      } else {
         this._list.addNode(element);
      }
   }

   /**
    * Removes and returns the element at the back of the deque.
    * @returns The element at the front of the deque.
    */
   removeBack(): T | null {
      let tail = this._list.getTail();
      if (tail) {
         let value = tail.value;
         this._list.removeNode(tail);
         return value;
      }
      return null;
   }
}
