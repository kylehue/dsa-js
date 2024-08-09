import { Trie } from "../../src/data-structures/trie";
import { describe, it, expect } from "vitest";

describe("Trie", () => {
   it("should insert and search words correctly", () => {
      const trie = new Trie();
      trie.insert("apple");
      trie.insert("app");
      trie.insert("application");

      expect(trie.search("apple")).toBe(true);
      expect(trie.search("app")).toBe(true);
      expect(trie.search("application")).toBe(true);
      expect(trie.search("appl")).toBe(false);
      expect(trie.search("appliance")).toBe(false);
   });

   it("should check if prefix exists correctly", () => {
      const trie = new Trie();
      trie.insert("banana");
      trie.insert("band");
      trie.insert("bandana");

      expect(trie.startsWith("ban")).toBe(true);
      expect(trie.startsWith("band")).toBe(true);
      expect(trie.startsWith("bandana")).toBe(true);
      expect(trie.startsWith("bandanas")).toBe(false);
      expect(trie.startsWith("cat")).toBe(false);
   });

   it("should delete words correctly", () => {
      const trie = new Trie();
      trie.insert("cat");
      trie.insert("car");
      trie.insert("cart");

      expect(trie.delete("car")).toBe(true);
      expect(trie.search("car")).toBe(false);
      expect(trie.search("cart")).toBe(true);
      expect(trie.search("cat")).toBe(true);

      expect(trie.delete("cart")).toBe(true);
      expect(trie.search("cart")).toBe(false);
      expect(trie.search("cat")).toBe(true);

      expect(trie.delete("cat")).toBe(true);
      expect(trie.search("cat")).toBe(false);

      expect(trie.isEmpty()).toBe(true);
   });

   it("should get all words correctly", () => {
      const trie = new Trie();
      trie.insert("dog");
      trie.insert("dove");
      trie.insert("door");

      expect(trie.getAllWords().sort()).toEqual(["dog", "door", "dove"].sort());
   });

   it("should check if the trie is empty correctly", () => {
      const trie = new Trie();
      expect(trie.isEmpty()).toBe(true);

      trie.insert("hello");
      expect(trie.isEmpty()).toBe(false);

      trie.delete("hello");
      expect(trie.isEmpty()).toBe(true);
   });

   it("should clear the trie correctly", () => {
      const trie = new Trie();
      trie.insert("test");
      trie.insert("trie");
      expect(trie.isEmpty()).toBe(false);

      trie.clear();
      expect(trie.isEmpty()).toBe(true);
      expect(trie.search("test")).toBe(false);
      expect(trie.search("trie")).toBe(false);
   });

   it("should find the longest prefix match correctly", () => {
      const trie = new Trie();
      trie.insert("car");
      trie.insert("cart");
      trie.insert("card");

      expect(trie.longestPrefixMatch("carton")).toBe("cart");
      expect(trie.longestPrefixMatch("carpenter")).toBe("car");
      expect(trie.longestPrefixMatch("cards")).toBe("card");
      expect(trie.longestPrefixMatch("dog")).toBe("");
   });

   it("should return autocomplete suggestions correctly", () => {
      const trie = new Trie();
      trie.insert("apple");
      trie.insert("app");
      trie.insert("apricot");
      trie.insert("banana");

      expect(trie.autocomplete("app").sort()).toEqual(["app", "apple"].sort());
      expect(trie.autocomplete("apr")).toEqual(["apricot"]);
      expect(trie.autocomplete("bana")).toEqual(["banana"]);
      expect(trie.autocomplete("cat")).toEqual([]);
   });
});
