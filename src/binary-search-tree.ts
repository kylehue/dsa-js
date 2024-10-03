import { Comparator, defaultComparator } from "./utils/comparator";

export class BinarySearchTree<T = number> {
   private _root: BinarySearchTreeNode<T> | undefined = undefined;
   private _size: number = 0;
   private _comparator: Comparator<T> = defaultComparator;

   /**
    * Creates a new instance of BinarySearchTree.
    *
    * @param comparator The comparator function to use. (Optional)
    */
   constructor(comparator?: Comparator<T>) {
      if (comparator) this._comparator = comparator;
   }

   /**
    * Inserts value into the tree.
    *
    * @param value The value to insert.
    *
    * @timeComplexity `O(log(n))`
    */
   insert(value: T): void {
      const newNode = new BinarySearchTreeNode(value);

      const helper = (
         node: BinarySearchTreeNode<T> | undefined
      ): BinarySearchTreeNode<T> => {
         if (node === undefined) {
            node = newNode;
            return node;
         }

         if (this._comparator(value, node.value()) < 0) {
            node.setLeft(helper(node.left()));
         } else {
            node.setRight(helper(node.right()));
         }

         // Rebalance
         return node.balance();
      };

      this._size++;
      this._root = helper(this._root);
   }

   /**
    * Deletes value from the tree.
    *
    * @param value The value to delete.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns The new successor node. This can also be `undefined` if
    * the deleted node doesn't have a successor or there was no deleted node.
    */
   delete(value: T): BinarySearchTreeNode<T> | undefined {
      let newSuccessor: BinarySearchTreeNode<T> | undefined = undefined;

      const helper = (
         node: BinarySearchTreeNode<T> | undefined
      ): BinarySearchTreeNode<T> | undefined => {
         if (node === undefined) return undefined;

         // If the node to delete has been found:
         if (value === node.value()) {
            this._size--;

            let left = node.left();
            let right = node.right();
            if (left && right) {
               // If node has 2 children, get the inorder successor.
               // For inorder successor, it can be both ways but let's choose
               // the lowest value in the right child.
               let successor = right;
               let successorParent = undefined;
               while (successor.left()) {
                  successorParent = successor;
                  successor = successor.left()!;
               }

               // Set left and right of the new successor to the left and
               // right of the node that is getting deleted.
               // Setting the left is straightforward but setting the right
               // child has a condition:

               // Here, we're gonna delete 5:
               //       5
               //     /   \
               //    2     6
               //   / \     \
               //  1   3     7

               // It becomes:
               //       6
               //     /   \
               //    2     7    <-- right must stay!
               //   / \
               //  1   3
               successor.setLeft(left);
               if (successor !== right) {
                  successor.setRight(right);
               }

               // Remove successor's parent reference to its left child,
               // that is if the left child exists.
               // For example:
               // Here, we're gonna delete 4:
               //       4
               //     /   \
               //    2     6
               //   / \   / \
               //  1   3 5   7

               //       5
               //     /   \
               //    2     6    <-- remove reference to 5
               //   / \     \
               //  1   3     7

               if (successorParent) {
                  successorParent.setLeft(undefined);
               }

               newSuccessor = successor;
            } else if (left && !right) {
               newSuccessor = left;
            } else if (!left && right) {
               newSuccessor = right;
            } else {
               newSuccessor = undefined;
            }

            // Dettach the node
            node.setLeft(undefined);
            node.setRight(undefined);

            // Return new successor
            return newSuccessor?.balance();
         }

         // If node hasn't been found, recursively find the node to delete
         else if (this._comparator(value, node.value()) < 0) {
            node.setLeft(helper(node.left()));
         } else {
            node.setRight(helper(node.right()));
         }

         return node.balance();
      };

      this._root = helper(this._root);

      return newSuccessor;
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
    * @returns An array of values that has been deleted.
    */
   filter(filterFunction: (value: T) => boolean): T[] {
      let arr = this.toArray();
      let deleted: T[] = [];
      for (let i = arr.length - 1; i >= 0; i--) {
         let value = arr[i];
         if (filterFunction(value)) continue;
         this.delete(value);
         deleted.push(value);
      }

      return deleted;
   }

   /**
    * Clears all elements from the tree.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._root = undefined;
      this._size = 0;
   }

   /**
    * Clones the tree.
    *
    * @timeComplexity `O(n)`
    */
   clone(): BinarySearchTree<T> {
      const cloneNode = (
         node: BinarySearchTreeNode<T> | undefined
      ): BinarySearchTreeNode<T> | undefined => {
         if (node === undefined) return undefined;

         let newNode = new BinarySearchTreeNode(node.value());
         newNode.setLeft(cloneNode(node.left()));
         newNode.setRight(cloneNode(node.right()));
         newNode.setHeight(node.height());

         return newNode;
      };

      const newTree = new BinarySearchTree<T>(this._comparator);
      newTree._root = cloneNode(this._root);
      newTree._size = this._size;

      return newTree;
   }

   /**
    * Converts the tree to a sorted array.
    *
    * @timeComplexity `O(n)`
    *
    * @returns An array representation of the tree.
    */
   toArray(): T[] {
      return [...this.values()];
   }

   /**
    * Finds the data with the smallest value in the tree.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns The minimum data or void if the tree is empty.
    */
   min(): T | undefined {
      if (this._root === undefined) return;
      let current = this._root;
      while (current.left() !== undefined) {
         current = current.left()!;
      }
      return current.value();
   }

   /**
    * Finds the data with the largest value in the tree.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns The maximum data or void if the tree is empty.
    */
   max(): T | undefined {
      if (this._root === undefined) return;
      let current = this._root;
      while (current.right() !== undefined) {
         current = current.right()!;
      }
      return current.value();
   }

   /**
    * Gets the size of the tree.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The number of nodes in the tree.
    */
   size(): number {
      return this._size;
   }

   /**
    * Checks if the tree is empty.
    *
    * @timeComplexity `O(1)`
    *
    * @returns True if the tree is empty, otherwise false.
    */
   isEmpty(): boolean {
      return this._size === 0;
   }

   /**
    * Gets the height of the tree.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The height of the tree.
    */
   height(): number {
      return this._root?.height() ?? 0;
   }

   root(): BinarySearchTreeNode<T> | undefined {
      if (!this._root) return undefined;
      return this._root;
   }

   *values(): Generator<T> {
      function* inorder(
         node: BinarySearchTreeNode<T> | undefined
      ): Generator<T> {
         if (node === undefined) return;
         yield* inorder(node.left());
         yield node.value();
         yield* inorder(node.right());
      }

      yield* inorder(this._root);
   }

   *[Symbol.iterator](): Generator<T> {
      yield* this.values();
   }

   /**
    * Creates an BinarySearchTree from an unsorted array of elements.
    *
    * @param array The array of elements to insert into the tree.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n * log(n))`
    *
    * @returns A new instance of BinarySearchTree.
    */
   static fromArray<T>(
      array: T[],
      comparator?: Comparator<T>
   ): BinarySearchTree<T> {
      const bst = new BinarySearchTree<T>(comparator);
      array.forEach((data) => bst.insert(data));
      return bst;
   }

   /**
    * Creates an BinarySearchTree from a sorted array of elements.
    *
    * @param array The array of elements to insert into the tree.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n)`
    *
    * @returns A new instance of BinarySearchTree.
    */
   static fromSortedArray<T>(
      array: T[],
      comparator?: Comparator<T>
   ): BinarySearchTree<T> {
      const bst = new BinarySearchTree<T>(comparator);

      const helper = (
         left: number,
         right: number
      ): BinarySearchTreeNode<T> | undefined => {
         if (left > right) return undefined;

         let mid = (left + right) >> 1;
         let root = new BinarySearchTreeNode(array[mid]);
         root.setLeft(helper(left, mid - 1));
         root.setRight(helper(mid + 1, right));
         root.updateHeight();

         return root;
      };

      bst._root = helper(0, array.length - 1);
      bst._size = array.length;

      return bst;
   }
}

export class BinarySearchTreeNode<T> {
   private _value: T;
   private _left: BinarySearchTreeNode<T> | undefined = undefined;
   private _right: BinarySearchTreeNode<T> | undefined = undefined;
   private _height: number = 1;

   constructor(value: T) {
      this._value = value;
   }

   /**
    * Get the left child of the node.
    *
    * @timeComplexity `O(1)`
    */
   left(): BinarySearchTreeNode<T> | undefined {
      return this._left;
   }

   /**
    * Get the right child of the node.
    *
    * @timeComplexity `O(1)`
    */
   right(): BinarySearchTreeNode<T> | undefined {
      return this._right;
   }

   /**
    * Get the value of the node.
    *
    * @timeComplexity `O(1)`
    */
   value(): T {
      return this._value;
   }

   /**
    * Get the height of the node.
    *
    * @timeComplexity `O(1)`
    */
   height(): number {
      return this._height;
   }

   /**
    * Change the left child of the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   setLeft(node: BinarySearchTreeNode<T> | undefined): void {
      this._left = node;
   }

   /**
    * Change the right child of the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   setRight(node: BinarySearchTreeNode<T> | undefined): void {
      this._right = node;
   }

   /**
    * Change the height of the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   setHeight(height: number): void {
      this._height = height;
   }

   /**
    * Updates the height of the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    */
   updateHeight(): void {
      this._height =
         1 + Math.max(this._left?._height ?? 0, this._right?._height ?? 0);
   }

   /**
    * Rotates the node to the left.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The new successor.
    */
   rotateLeft(): BinarySearchTreeNode<T> {
      let right = this._right;
      if (right === undefined) return this;

      this._right = right._left;
      right._left = this;

      this.updateHeight();
      right.updateHeight();

      return right;
   }

   /**
    * Rotates the node to the right.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The new successor.
    */
   rotateRight(): BinarySearchTreeNode<T> {
      let left = this._left;
      if (left === undefined) return this;

      this._left = left._right;
      left._right = this;

      this.updateHeight();
      left.updateHeight();

      return left;
   }

   /**
    * Compute the balance factor of the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The balance factor.
    */
   computeBalanceFactor(): number {
      let leftHeight = this._left?._height ?? 0;
      let rightHeight = this._right?._height ?? 0;
      return leftHeight - rightHeight;
   }

   /**
    * Balances the node.
    *
    * For internal use only.
    *
    * @timeComplexity `O(1)`
    *
    * @returns The new successor.
    */
   balance(): BinarySearchTreeNode<T> {
      // Update height
      this.updateHeight();

      let factor = this.computeBalanceFactor();

      // Left-heavy
      if (factor > 1) {
         // If the left child is right-heavy,
         // then we have to rotate the left child to the left.
         let left = this.left();
         if (left !== undefined && left.computeBalanceFactor() < 0) {
            this.setLeft(left.rotateLeft());
         }

         return this.rotateRight();
      }

      // Right-heavy
      else if (factor < -1) {
         // If the right child if left-heavy,
         // then we have to rotate the right child to the right.
         let right = this.right();
         if (right !== undefined && right.computeBalanceFactor() > 0) {
            this.setRight(right.rotateRight());
         }

         return this.rotateLeft();
      }

      return this;
   }
}
