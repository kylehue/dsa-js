import { LinkedList, ListNode } from "./linked-list";

type Cache<K, V> = [V, ListNode<K>];

export class LRUCache<K, V> {
   private _capacity: number;
   private _list = new LinkedList<K>();
   private _cache = new Map<K, Cache<K, V>>();

   constructor(capacity: number = 100) {
      this._capacity = capacity;
   }

   private _reenqueue(key: K, cache: Cache<K, V>) {
      if (!cache) throw new Error("Cache doesn't exist to be re-enqueued");
      this._list.deleteNode(cache[1]);
      cache[1] = this._list.append(key);
   }

   /**
    * Returns a specified element from the cache.
    */
   get(key: K): V | void {
      let cache = this._cache.get(key);
      if (cache === undefined) return;
      this._reenqueue(key, cache);

      return cache[0];
   }

   /**
    * Adds a new element with a specified key and value to the cache.
    * If an element with the same key already exists, the element will
    * be updated and marked as the most recent.
    */
   set(key: K, value: V): void {
      let cache = this._cache.get(key);
      // if it already exists, just update
      if (cache !== undefined) {
         cache[0] = value;
         this._reenqueue(key, cache);
      } else {
         // before adding, we must limit the capacity
         if (this._list.size() >= this._capacity) {
            let head = this._list.head()!;
            let key = head.value;
            this._list.deleteNode(head);
            this._cache.delete(key);
         }

         // enqueue
         let newNode = this._list.append(key);
         this._cache.set(key, [value, newNode]);
      }
   }

   /**
    * Returns whether an element with the specified key exists or not.
    */
   has(key: K): boolean {
      return this._cache.has(key);
   }

   /**
    * Deletes a specified element from the cache.
    *
    * @returns True if the element was deleted, false otherwise.
    */
   delete(key: K): boolean {
      let cache = this._cache.get(key);
      if (cache === undefined) return false;

      this._list.deleteNode(cache[1]);
      return this._cache.delete(key);
   }

   /**
    * Clears the cache.
    */
   clear(): void {
      this._cache.clear();
      this._list.clear();
   }

   size(): number {
      return this._cache.size;
   }

   entries(): IterableIterator<[K, V]> {
      let current = this._list.head();
      let $this = this;
      return {
         next(): IteratorResult<[K, V]> {
            if (current !== undefined) {
               let key = current.value;
               let value = $this._cache.get(key)![0];
               current = current.next();
               return { value: [key, value], done: false };
            }
            return { value: undefined as any, done: true };
         },
         [Symbol.iterator](): IterableIterator<[K, V]> {
            return this;
         },
      };
   }

   keys(): IterableIterator<K> {
      let entries = this.entries();
      return {
         next(): IteratorResult<K> {
            let next = entries.next().value;
            if (next !== undefined) return { value: next[0], done: false };
            return { value: undefined as any, done: true };
         },
         [Symbol.iterator](): IterableIterator<K> {
            return this;
         },
      };
   }

   values(): IterableIterator<V> {
      let entries = this.entries();
      return {
         next(): IteratorResult<V> {
            let next = entries.next().value;
            if (next !== undefined) return { value: next[1], done: false };
            return { value: undefined as any, done: true };
         },
         [Symbol.iterator](): IterableIterator<V> {
            return this;
         },
      };
   }

   [Symbol.iterator](): Iterator<[K, V]> {
      let entries = this.entries();
      return {
         next(): IteratorResult<[K, V]> {
            let next = entries.next().value;
            if (next !== undefined) return { value: next, done: false };
            return { value: undefined as any, done: true };
         },
      };
   }
}
