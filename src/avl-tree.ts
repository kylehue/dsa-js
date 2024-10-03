import { Comparator, defaultComparator } from "./utils/comparator";

export class AVLTree<T = number> {
   private _root: AVLTreeNode<T> | undefined = undefined;
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

      const helper = (node: AVLTreeNode<T> | undefined): AVLTreeNode<T> => {
         if (node === undefined) {
            node = newNode;
            return node;
         }

         if (this._comparator(value, node.value()) < 0) {
            changeLeft(node, helper(node.left()));
         } else {
            changeRight(node, helper(node.right()));
         }

         // Rebalance
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
    * @returns The new successor node. This can also be `undefined` if
    * the deleted node doesn't have a successor or there was no deleted node.
    */
   delete(value: T): AVLTreeNode<T> | undefined {
      let newSuccessor: AVLTreeNode<T> | undefined = undefined;

      const helper = (
         node: AVLTreeNode<T> | undefined
      ): AVLTreeNode<T> | undefined => {
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

               changeLeft(successor, left);
               if (successor === right) {
                  changeRight(right, right.right());
               } else {
                  changeRight(successor, right);
               }

               if (successorParent) {
                  changeLeft(successorParent, undefined);
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
            changeLeft(node, undefined);
            changeRight(node, undefined);

            // Return new successor
            return newSuccessor ? this._balance(newSuccessor) : newSuccessor;
         }

         // If node hasn't been found, recursively find the node to delete
         else if (this._comparator(value, node.value()) < 0) {
            changeLeft(node, helper(node.left()));
         } else {
            changeRight(node, helper(node.right()));
         }

         return this._balance(node);
      };

      this._root = helper(this._root);

      return newSuccessor;
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
      this._root = undefined;
      this._size = 0;
   }

   /**
    * Clones the tree.
    *
    * @timeComplexity `O(n)`
    */
   clone(): AVLTree<T> {
      const cloneNode = (
         node: AVLTreeNode<T> | undefined
      ): AVLTreeNode<T> | undefined => {
         if (node === undefined) return undefined;

         const newNode = new AVLTreeNode(node.value());

         changeLeft(newNode, cloneNode(node.left()));
         changeRight(newNode, cloneNode(node.right()));
         changeHeight(newNode, node.height());

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
      return this._getHeight(this._root);
   }

   root(): AVLTreeNode<T> | undefined {
      if (!this._root) return undefined;
      return this._root;
   }

   *values(): Generator<T> {
      function* inorder(node: AVLTreeNode<T> | undefined): Generator<T> {
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
    * Creates an AVLTree from an unsorted array of elements.
    *
    * @param array The array of elements to insert into the tree.
    * @param comparator The comparator function to use. (Optional)
    *
    * @timeComplexity `O(n * log(n))`
    *
    * @returns A new instance of AVLTree.
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
    * @returns A new instance of AVLTree.
    */
   static fromSortedArray<T>(
      array: T[],
      comparator?: Comparator<T>
   ): AVLTree<T> {
      const avlTree = new AVLTree<T>(comparator);

      const helper = (
         left: number,
         right: number
      ): AVLTreeNode<T> | undefined => {
         if (left > right) return undefined;

         let mid = (left + right) >> 1;
         let root = new AVLTreeNode(array[mid]);
         changeLeft(root, helper(left, mid - 1));
         changeRight(root, helper(mid + 1, right));
         changeHeight(root, 1 + avlTree._calculateHeight(root));

         return root;
      };

      avlTree._root = helper(0, array.length - 1);
      avlTree._size = array.length;

      return avlTree;
   }

   private _balance(node: AVLTreeNode<T>): AVLTreeNode<T> {
      let factor = this._getBalanceFactor(node);

      // Update height and rebalance
      changeHeight(node, 1 + this._calculateHeight(node));

      // Left-heavy
      if (factor > 1) {
         // If the left child is right-heavy,
         // then we have to rotate the left child to the left.
         let left = node.left();
         if (left !== undefined && this._getBalanceFactor(left) < 0) {
            changeLeft(node, this._rotateLeft(left));
         }

         return this._rotateRight(node);
      }

      // Right-heavy
      else if (factor < -1) {
         // If the right child if left-heavy,
         // then we have to rotate the right child to the right.
         let right = node.right();
         if (right !== undefined && this._getBalanceFactor(right) > 0) {
            changeRight(node, this._rotateRight(right!));
         }

         return this._rotateLeft(node);
      }

      return node;
   }

   private _rotateLeft(node: AVLTreeNode<T>): AVLTreeNode<T> {
      let right = node.right();
      if (right === undefined) return node;

      changeRight(node, right.left());
      changeLeft(right, node);

      changeHeight(node, 1 + this._calculateHeight(node));
      changeHeight(right, 1 + this._calculateHeight(right));

      return right;
   }

   private _rotateRight(node: AVLTreeNode<T>): AVLTreeNode<T> {
      let left = node.left();
      if (left === undefined) return node;

      changeLeft(node, left.right());
      changeRight(left, node);

      changeHeight(node, 1 + this._calculateHeight(node));
      changeHeight(left, 1 + this._calculateHeight(left));

      return left;
   }

   private _getBalanceFactor(node: AVLTreeNode<T> | undefined): number {
      if (node === undefined) return 0;
      return this._getHeight(node.left()) - this._getHeight(node.right());
   }

   private _calculateHeight(node: AVLTreeNode<T> | undefined): number {
      if (node === undefined) return 0;
      return Math.max(
         this._getHeight(node.left()),
         this._getHeight(node.right())
      );
   }

   private _getHeight(node: AVLTreeNode<T> | undefined): number {
      if (node === undefined) return 0;
      return node.height();
   }
}

export class AVLTreeNode<T> {
   private _value: T;
   private _left: AVLTreeNode<T> | undefined = undefined;
   private _right: AVLTreeNode<T> | undefined = undefined;
   private _height: number = 1;

   constructor(value: T) {
      this._value = value;
   }

   left(): AVLTreeNode<T> | undefined {
      return this._left;
   }

   right(): AVLTreeNode<T> | undefined {
      return this._right;
   }

   value(): T {
      return this._value;
   }

   height(): number {
      return this._height;
   }
}

export type AVLTreeValueMapper<T> = (data: T) => number;

/*
 * Helper functions to change node properties without making typescript mad.
 */

function changeLeft<T>(node: AVLTreeNode<T>, left: AVLTreeNode<T> | undefined) {
   // @ts-ignore
   node._left = left;
}

function changeRight<T>(
   node: AVLTreeNode<T>,
   right: AVLTreeNode<T> | undefined
) {
   // @ts-ignore
   node._right = right;
}

function changeHeight<T>(node: AVLTreeNode<T>, height: number) {
   // @ts-ignore
   node._height = height;
}

function changeValue<T>(node: AVLTreeNode<T>, value: T) {
   // @ts-ignore
   node._value = value;
}
