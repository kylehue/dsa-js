class TrieNode {
   public children: Map<string, TrieNode>;
   public isEndOfWord: boolean;
   public readonly value: string;

   constructor(value: string) {
      this.value = value;
      this.children = new Map();
      this.isEndOfWord = false;
   }

   addChild(char: string): TrieNode {
      let node = this.children.get(char);
      if (!node) {
         node = new TrieNode(char);
         this.children.set(char, node);
      }
      return node;
   }
}

export class Trie {
   private _root = new TrieNode("");

   /**
    * Inserts a word into the trie.
    *
    * @param word The word to insert.
    */
   insert(word: string): void {
      let current = this._root;
      for (const char of word) {
         current = current.addChild(char);
      }
      current.isEndOfWord = true;
   }

   /**
    * Searches for a word in the trie.
    *
    * @param word The word to search for.
    * @returns True if the word is found, false otherwise.
    */
   search(word: string): boolean {
      let current: TrieNode | undefined = this._root;
      for (const char of word) {
         current = current.children.get(char);
         if (!current) return false;
      }
      return current.isEndOfWord;
   }

   /**
    * Checks if any word in the trie starts with the given prefix.
    *
    * @param prefix The prefix to check.
    * @returns True if the prefix is found, false otherwise.
    */
   startsWith(prefix: string): boolean {
      let current: TrieNode | undefined = this._root;
      for (const char of prefix) {
         current = current.children.get(char);
         if (!current) return false;
      }
      return true;
   }

   /**
    * Deletes a word from the trie.
    *
    * @param word The word to delete.
    * @returns True if the word was successfully deleted, false if the
    * word was not found.
    */
   delete(word: string): boolean {
      let info = { deleted: false }; // pass by reference (yeah this is ugly)
      this._deleteHelper(this._root, word, 0, info);
      return info.deleted;
   }
   private _deleteHelper(
      node: TrieNode,
      word: string,
      index: number,
      info: any
   ): boolean {
      if (index === word.length) {
         if (!node.isEndOfWord) return false;
         node.isEndOfWord = false;
         info.deleted = true;
         return node.children.size === 0; // should only delete if no children
      }

      const char = word[index];
      const childNode = node.children.get(char);
      if (!childNode) return false;

      const shouldDeleteChild = this._deleteHelper(
         childNode,
         word,
         index + 1,
         info
      );

      if (shouldDeleteChild) {
         node.children.delete(char);
         info.deleted = true;
         return node.children.size === 0 && !node.isEndOfWord;
      }

      return false;
   }

   /**
    * Returns all words in the trie.
    *
    * @returns An array of all words stored in the trie.
    */
   getAllWords(): string[] {
      return this._collectWords(this._root, "");
   }

   /**
    * Checks if the trie is empty.
    *
    * @returns True if the trie is empty, false otherwise.
    */
   isEmpty(): boolean {
      return this._root.children.size === 0;
   }

   /**
    * Clears all words from the trie.
    */
   clear(): void {
      this._root = new TrieNode("");
   }

   /**
    * Finds the longest prefix of the given word that exists in the trie.
    *
    * @param word The word to find the longest prefix for.
    * @returns The longest prefix found in the trie.
    */
   longestPrefixMatch(word: string): string {
      let current = this._root;
      let longestPrefix = "";
      let currentPrefix = "";

      for (const char of word) {
         currentPrefix += char;
         const node = current.children.get(char);
         if (!node) break;

         current = node;
         if (node.isEndOfWord) {
            longestPrefix = currentPrefix;
         }
      }

      return longestPrefix;
   }

   /**
    * Returns a list of all words in the trie with the given prefix.
    *
    * @param prefix The prefix to autocomplete.
    * @returns An array of words that start with the given prefix.
    */
   autocomplete(prefix: string): string[] {
      let current: TrieNode | undefined = this._root;
      for (const char of prefix) {
         current = current.children.get(char);
         if (!current) return [];
      }

      return this._collectWords(current, prefix);
   }
   private _collectWords(node: TrieNode, prefix: string): string[] {
      const words: string[] = [];
      if (node.isEndOfWord) {
         words.push(prefix);
      }

      for (const [char, childNode] of node.children) {
         words.push(...this._collectWords(childNode, prefix + char));
      }

      return words;
   }
}
