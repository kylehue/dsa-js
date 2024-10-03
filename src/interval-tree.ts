import { BinarySearchTree, BinarySearchTreeNode } from "./binary-search-tree";
import { isOverlapping } from "./utils/common";

export class IntervalTree<T = any> {
   private readonly _rangeMapper: IntervalTreeRangeMapper<T>;
   private _tree = new BinarySearchTree<IntervalTreeData<T>>(
      (a, b) => a.lowerBound - b.lowerBound
   );

   /**
    * @param rangeMapper Function that maps data to its interval bounds.
    */
   constructor(rangeMapper: IntervalTreeRangeMapper<T>) {
      this._rangeMapper = rangeMapper;
   }

   /**
    * Inserts a new interval into the tree.
    *
    * @param data The data to add to the tree.
    *
    * @timeComplexity `O(log(n))`
    *
    */
   insert(data: T): void {
      let [lower, upper] = this._rangeMapper(data);
      if (lower > upper) {
         throw new RangeError(
            "Lower bound must be less than the higher bound."
         );
      }

      const newNode = new IntervalTreeData(lower, upper, upper, data);
      this._tree.insert(newNode);
      this._recomputeMaxUpperBound(data);
   }

   /**
    * Deletes an interval from the tree.
    *
    * @param data The data whose interval is to be deleted from the tree.
    *
    * @timeComplexity `O(log(n))`
    */
   delete(data: T): void {
      for (let { node, parent } of this._traverseTo(data)) {
         if (node.value().data !== data) continue;

         let successor = this._tree.delete(node.value()) ?? parent;
         if (successor !== undefined) {
            this._recomputeMaxUpperBound(successor.value().data);
         }
      }
   }

   /**
    * Deletes values that doesn't meet the filter function condition.
    *
    * @param filterFunction A function that decides which values to delete.
    * It should return `false` if the value needs to be deleted,
    * otherwise `true`.
    *
    * @timeComplexity `O(n + k * log(n))` where `k` is the number of values
    * that doesn't meet the filter function condition.
    *
    * @retuns An array of intervals that has been deleted.
    */
   filter(filterFunction: (value: T) => boolean): T[] {
      // Convert to array
      let arr: IntervalTreeData<T>[] = [];
      function dfs(
         node: BinarySearchTreeNode<IntervalTreeData<T>> | undefined
      ) {
         if (node === undefined) return;
         arr.push(node.value());
         dfs(node.left());
         dfs(node.right());
      }
      dfs(this._tree.root());

      // Delete
      let deleted: T[] = [];
      for (let intervalData of arr) {
         if (filterFunction(intervalData.data)) continue;
         this.delete(intervalData.data);
         deleted.push(intervalData.data);
      }

      return deleted;
   }

   /**
    * Deletes values that overlap within provided range.
    *
    * @param lower The lower bound of the range.
    * @param upper The upper bound of the range.
    * @param inclusive Set to `true` to include intervals that doesn't
    * overlap but touch the given lower or upper bound. Default is `false`.
    *
    * @timeComplexity `O(n + k * log(n))` where `k` is the number of values
    * that is getting deleted.
    *
    * @retuns An array of intervals that has been deleted.
    */
   deleteInRange(lower: number, upper: number, inclusive?: boolean): T[] {
      return this.filter((x) => {
         let [lowerBound, upperBound] = this._rangeMapper(x);
         let isOverlappingInclusive =
            inclusive && (lowerBound === upper || upperBound === lower);
         return !(
            isOverlappingInclusive ||
            isOverlapping(lower, upper, lowerBound, upperBound)
         );
      });
   }

   /**
    * Queries all intervals that overlap with the provided range.
    *
    * @param lower The lower bound of the range.
    * @param upper The upper bound of the range.
    * @param inclusive Set to `true` to include intervals that doesn't
    * overlap but touch the given lower or upper bound. Default is `false`.
    *
    * @timeComplexity `O(k + log(n))` where `k` is the number of intervals
    * that overlap within the given range.
    *
    * @returns Array of data whose intervals overlap with the range.
    */
   query(lower: number, upper: number, inclusive?: boolean): T[] {
      if (lower > upper) {
         throw new RangeError(
            "Lower bound must be less than the higher bound."
         );
      }

      return [...this.rangeQuery(lower, upper, inclusive)];
   }

   /**
    * Checks whether any intervals overlap with the provided range.
    *
    * @param lower The lower bound of the range.
    * @param upper The upper bound of the range.
    * @param inclusive Set to `true` to check intervals that doesn't
    * overlap but touch the given lower or upper bound. Default is `false`.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns True if any interval overlaps with the given range,
    * otherwise false.
    */
   hasOverlap(lower: number, upper: number, inclusive?: boolean): boolean {
      if (lower > upper) {
         throw new RangeError(
            "Lower bound must be less than the higher bound."
         );
      }

      for (let _ of this.rangeQuery(lower, upper, inclusive)) return true;
      return false;
   }

   /**
    * Clears the tree.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._tree.clear();
   }

   /**
    * Returns the number of intervals stored in the tree.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The number of intervals.
    */
   size(): number {
      return this._tree.size();
   }

   /**
    * Checks if the interval tree is empty.
    *
    * @timeComplexity `O(1)`
    *
    * @returns True if the tree is empty, otherwise false.
    */
   isEmpty(): boolean {
      return this._tree.isEmpty();
   }

   /**
    * Creates a shallow clone of the interval tree.
    *
    * @timeComplexity `O(n)`
    *
    * @returns A new cloned instance of the interval tree.
    */
   clone(): IntervalTree<T> {
      const intervalTree = new IntervalTree<T>(this._rangeMapper);
      intervalTree._tree = this._tree.clone();
      return intervalTree;
   }

   /**
    * Same as `query` but it uses a generator.
    *
    * @param lower The lower bound of the range.
    * @param upper The upper bound of the range.
    * @param inclusive Set to `true` to include intervals that doesn't
    * overlap but touch the given lower or upper bound. Default is `false`.
    *
    * @timeComplexity `O(k + log(n))` where `k` is the number of intervals
    * that overlap within the given range.
    *
    * @yields The data of intervals overlapping with the range.
    */
   *rangeQuery(
      lower: number,
      upper: number,
      inclusive?: boolean
   ): Generator<T> {
      if (lower > upper) {
         throw new RangeError(
            "Lower bound must be less than the higher bound."
         );
      }

      function* dfs(
         node: BinarySearchTreeNode<IntervalTreeData<T>> | undefined
      ): Generator<T> {
         if (node === undefined) return;

         const { lowerBound, upperBound, data } = node.value();

         let isOverlappingInclusive =
            inclusive && (lowerBound === upper || upperBound === lower);
         if (
            isOverlappingInclusive ||
            isOverlapping(lower, upper, lowerBound, upperBound)
         ) {
            yield data;
         }

         let left = node.left();
         if (left && left.value().maxUpperBound >= lower) {
            yield* dfs(left);
         }

         // Always check the right child
         yield* dfs(node.right());
      }

      yield* dfs(this._tree.root());
   }

   *values() {
      yield* this.rangeQuery(-Infinity, Infinity);
   }

   *[Symbol.iterator]() {
      yield* this.values();
   }

   /**
    * Constructs an interval tree from an array of data.
    *
    * @param array The array of data.
    * @param rangeMapper The function to map each data item to its interval.
    *
    * @timeComplexity `O(n * log(n))`
    *
    * @returns The newly constructed interval tree.
    */
   static fromArray<T>(
      array: T[],
      rangeMapper: IntervalTreeRangeMapper<T>
   ): IntervalTree<T> {
      let it = new IntervalTree<T>(rangeMapper);
      array.forEach((data) => it.insert(data));
      return it;
   }

   /**
    * Recomputes the max upper bound of each node in the path to the given data.
    *
    * @param data The data for which to recompute the max upper bound.
    *
    * @timeComplexity `O(log(n))`
    */
   private _recomputeMaxUpperBound(data: T) {
      for (let { node } of this._traverseTo(data)) {
         let upperBound = node.value().upperBound;
         node.value().maxUpperBound = Math.max(
            upperBound,
            node.left()?.value().maxUpperBound ?? upperBound,
            node.right()?.value().maxUpperBound ?? upperBound
         );
      }
   }

   /**
    * Traverses the tree to find the node associated with the provided data.
    * @param data The data to traverse to.
    *
    * @timeComplexity `O(log(n))`
    *
    * @yields Nodes along the path to the target node.
    */
   private *_traverseTo(data: T) {
      let value = this._rangeMapper(data)[0];
      function* dfs(
         node: BinarySearchTreeNode<IntervalTreeData<T>> | undefined,
         parent: BinarySearchTreeNode<IntervalTreeData<T>> | undefined
      ): Generator<{
         node: BinarySearchTreeNode<IntervalTreeData<T>>;
         parent: BinarySearchTreeNode<IntervalTreeData<T>> | undefined;
      }> {
         if (node === undefined) return;
         let lowerBound = node.value().lowerBound;

         // Stop if we found the source data
         if (node.value().data === data) {
            yield { node, parent };
            return;
         }

         // Continue traversing until we find the source data
         if (value < lowerBound) {
            yield* dfs(node.left(), node);
         } else {
            yield* dfs(node.right(), node);
         }

         yield { node, parent }; // post-order
      }

      yield* dfs(this._tree.root(), undefined);
   }
}

class IntervalTreeData<T> {
   public data: T;
   public lowerBound: number;
   public upperBound: number;
   public maxUpperBound: number;

   constructor(
      lowerBound: number,
      upperBound: number,
      maxUpperBound: number,
      data: T
   ) {
      this.data = data;
      this.lowerBound = lowerBound;
      this.upperBound = upperBound;
      this.maxUpperBound = maxUpperBound;
   }
}

export type IntervalTreeRangeMapper<T> = (data: T) => [number, number];
