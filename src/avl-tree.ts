import { Comparator, defaultComparator } from "./utils/comparator";

export class AVLTree<T = number> {
   private _root: AVLTreeNode<T> | null = null;
   private _size: number = 0;
   private _comparator: Comparator<T> = defaultComparator;

   /**
    * Creates a new instance of AVLTree.
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
      const newNode = new AVLTreeNode(value);

      const helper = (node: AVLTreeNode<T> | null): AVLTreeNode<T> => {
         if (node === null) {
            node = newNode;
            return node;
         }

         if (this._comparator(value, node.value) < 0) {
            node.left = helper(node.left);
         } else {
            node.right = helper(node.right);
         }

         // Update height and rebalance
         node.height = 1 + this._calculateHeight(node);
         return this._balance(node);
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
    * @returns True if the value was found and deleted, otherwise false.
    */
   delete(value: T): boolean {
      let isDeleted = false;

      const helper = (node: AVLTreeNode<T> | null): AVLTreeNode<T> | null => {
         if (node === null) return null;

         // If the node to delete has been found:
         if (value === node.value) {
            isDeleted = true;

            // If the node to be deleted only has 1 child, then
            // return that child as the successor.
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            // If node has 2 children, get the inorder successor.
            // For inorder successor, it can be both ways but let's choose
            // the lowest value in the right child.
            let successor = node.right;
            while (successor.left !== null) {
               successor = successor.left;
            }

            // Copy the inorder successor's data to this node
            node.value = successor.value;

            // Delete the inorder successor
            node.right = helper(node.right);
         }

         // If node hasn't been found, recursively find the node to delete
         else if (this._comparator(value, node.value) < 0) {
            node.left = helper(node.left);
         } else {
            node.right = helper(node.right);
         }

         // Update height and rebalance
         node.height = 1 + this._calculateHeight(node);
         return this._balance(node);
      };

      this._root = helper(this._root);

      if (isDeleted) this._size--;
      return isDeleted;
   }

   /**
    * Rebuilds the tree.
    *
    * @timeComplexity `O(n)`
    */
   rebuild(): void {
      this._root = AVLTree.fromSortedArray(this.toArray())._root;
   }

   /**
    * Clears all elements from the tree.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._root = null;
      this._size = 0;
   }

   /**
    * Clones the tree.
    *
    * @timeComplexity `O(n)`
    */
   clone(): AVLTree<T> {
      const cloneNode = (
         node: AVLTreeNode<T> | null
      ): AVLTreeNode<T> | null => {
         if (node === null) return null;

         const newNode = new AVLTreeNode(node.value);
         newNode.left = cloneNode(node.left);
         newNode.right = cloneNode(node.right);
         newNode.height = node.height;

         return newNode;
      };

      const newTree = new AVLTree<T>(this._comparator);
      newTree._root = cloneNode(this._root);
      newTree._size = this._size;

      return newTree;
   }

   /**
    * Converts the tree to a sorted array.
    *
    * @timeComplexity `O(n)`
    *
    * @returns An array representation of the AVL tree.
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
      if (this._root === null) return;
      let current = this._root;
      while (current.left !== null) {
         current = current.left;
      }
      return current.value;
   }

   /**
    * Finds the data with the largest value in the tree.
    *
    * @timeComplexity `O(log(n))`
    *
    * @returns The maximum data or void if the tree is empty.
    */
   max(): T | undefined {
      if (this._root === null) return;
      let current = this._root;
      while (current.right !== null) {
         current = current.right;
      }
      return current.value;
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
      return this._getHeight(this._root);
   }

   /**
    * Traverses the tree in a depth-first search manner.
    *
    * @param callback A callback function that gives the value as a parameter.
    *
    * The function should return:
    * - `"left"` to continue traversing to the left child.
    * - `"right"` to continue traversing to the right child.
    * - `"both"` to continue traversing to both children.
    * - `undefined` if no further traversal is desired.
    *
    * @timeComplexity `O(log(n))`
    */
   traverse(callback: (value: T) => "left" | "right" | "both" | void): void {
      if (this._root === null) return;

      function dfs(node: AVLTreeNode<T> | null) {
         if (node === null) return;
         let next = callback(node.value);
         if (next === "left" || next === "right") {
            dfs(node[next]);
         } else if (next === "both") {
            dfs(node.left);
            dfs(node.right);
         }
      }

      dfs(this._root);
   }

   *values(): Generator<T> {
      function* inorder(node: AVLTreeNode<T> | null): Generator<T> {
         if (node === null) return;
         yield* inorder(node.left);
         yield node.value;
         yield* inorder(node.right);
      }

      yield* inorder(this._root);
   }

   *[Symbol.iterator](): Generator<T> {
      yield* this.values();
   }

   /**
    * Creates an AVLTree from an unsorted array of elements.
    *
    * @param array The array of elements to insert into the tree.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n * log(n))`
    *
    * @returns {AVLTree<T>} A new instance of AVLTree.
    */
   static fromArray<T>(array: T[], comparator?: Comparator<T>): AVLTree<T> {
      const avlTree = new AVLTree<T>(comparator);
      array.forEach((data) => avlTree.insert(data));
      return avlTree;
   }

   /**
    * Creates an AVLTree from a sorted array of elements.
    *
    * @param array The array of elements to insert into the tree.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n)`
    *
    * @returns {AVLTree<T>} A new instance of AVLTree.
    */
   static fromSortedArray<T>(
      array: T[],
      comparator?: Comparator<T>
   ): AVLTree<T> {
      const avlTree = new AVLTree<T>(comparator);

      const helper = (left: number, right: number): AVLTreeNode<T> | null => {
         if (left > right) return null;

         let mid = (left + right) >> 1;
         let root = new AVLTreeNode(array[mid]);
         root.left = helper(left, mid - 1);
         root.right = helper(mid + 1, right);
         root.height = 1 + avlTree._calculateHeight(root);

         return root;
      };

      avlTree._root = helper(0, array.length - 1);
      avlTree._size = array.length;

      return avlTree;
   }

   private _balance(node: AVLTreeNode<T>): AVLTreeNode<T> {
      let factor = this._getBalanceFactor(node);

      // Left-heavy
      if (factor > 1) {
         // If the left child is right-heavy,
         // then we have to rotate the left child to the left.
         if (node.left !== null && this._getBalanceFactor(node.left) < 0) {
            node.left = this._rotateLeft(node.left);
         }

         return this._rotateRight(node);
      }

      // Right-heavy
      else if (factor < -1) {
         // If the right child if left-heavy,
         // then we have to rotate the right child to the right.
         if (node.right !== null && this._getBalanceFactor(node.right) > 0) {
            node.right = this._rotateRight(node.right);
         }

         return this._rotateLeft(node);
      }

      return node;
   }

   private _rotateLeft(node: AVLTreeNode<T>): AVLTreeNode<T> {
      if (node.right === null) return node;

      let right = node.right;
      node.right = right.left;
      right.left = node;

      node.height = 1 + this._calculateHeight(node);
      right.height = 1 + this._calculateHeight(right);

      return right;
   }

   private _rotateRight(node: AVLTreeNode<T>): AVLTreeNode<T> {
      if (node.left === null) return node;

      let left = node.left;
      node.left = left.right;
      left.right = node;

      node.height = 1 + this._calculateHeight(node);
      left.height = 1 + this._calculateHeight(left);

      return left;
   }

   private _getBalanceFactor(node: AVLTreeNode<T> | null): number {
      if (node === null) return 0;
      return this._getHeight(node.left) - this._getHeight(node.right);
   }

   private _calculateHeight(node: AVLTreeNode<T> | null): number {
      if (node === null) return 0;
      return Math.max(this._getHeight(node.left), this._getHeight(node.right));
   }

   private _getHeight(node: AVLTreeNode<T> | null): number {
      if (node === null) return 0;
      return node.height;
   }
}

class AVLTreeNode<T> {
   public value: T;
   public left: AVLTreeNode<T> | null = null;
   public right: AVLTreeNode<T> | null = null;
   public height: number = 1;

   constructor(value: T) {
      this.value = value;
   }
}

export type AVLTreeValueMapper<T> = (data: T) => number;
