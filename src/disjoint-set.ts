export class DisjointSet<T = number> {
   private _parentMap = new Map<T, T>();
   private _rankMap = new Map<T, number>();

   /**
    * Adds a new node to the disjoint set.
    *
    * @param node The node to add.
    *
    * @returns Returns false if the node is already in the disjoint set.
    */
   add(node: T): boolean {
      if (this._parentMap.has(node)) return false;
      this._parentMap.set(node, node);
      this._rankMap.set(node, 0);
      return true;
   }

   /**
    * Finds the root of the set containing the given node.
    *
    * @param node The node to find.
    *
    * @returns The representative node of the set, or null if the node
    * is not found.
    */
   find(node: T): T | void {
      let parent = this._parentMap.get(node);
      if (!parent) return;
      if (parent === node) return node;

      let root = this.find(parent);
      if (!root) return parent;

      this._parentMap.set(node, root);
      return root;
   }

   /**
    * Finds the root of the set containing the given node.
    * It adds the node to the set if it does not exist.
    *
    * @param node The node to find or add.
    * @returns The representative node of the set.
    */
   findOrAdd(node: T): T {
      let parent = this.find(node);
      if (!parent) {
         this.add(node);
         return node;
      }
      return parent;
   }

   /**
    * Unites the sets containing the 2 given nodes.
    *
    * @param nodeA The first node.
    * @param nodeB The second node.
    *
    * @returns Returns false if the 2 nodes are already in the same set.
    */
   union(nodeA: T, nodeB: T): boolean {
      let parentA = this.findOrAdd(nodeA);
      let parentB = this.findOrAdd(nodeB);

      if (parentA === parentB) return false;

      let rankA = this._rankMap.get(parentA) ?? 0;
      let rankB = this._rankMap.get(parentB) ?? 0;

      if (rankA === rankB) {
         this._parentMap.set(parentA, parentB);
         this._rankMap.set(parentB, rankB + 1);
      } else if (rankA > rankB) {
         this._parentMap.set(parentB, parentA);
      } else {
         this._parentMap.set(parentA, parentB);
      }

      return true;
   }

   /**
    * Clears the disjoint set.
    */
   clear(): void {
      this._parentMap.clear();
      this._rankMap.clear();
   }

   /**
    * Returns the number of elements in the disjoint set.
    */
   size(): number {
      return this._parentMap.size;
   }
}
