import { Heap, Queue, Deque, Trie, DisjointSet } from "../src/index";

const pq = new Heap<number>();
for (let i = 0; i < 100; i++) {
   pq.push(~~(Math.random() * 100));
}
console.log(pq.toArray());

const q = new Deque<number>();
for (let i = 0; i < 5; i++) {
   q.enqueue(~~(Math.random() * 100));
}
for (const value of q) {
   console.log(value);
}

const trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("apricot");
console.log(trie.delete("app"));
console.log(trie.autocomplete("app"));

const ds = new DisjointSet<string>();
ds.union("a", "b");
console.log(ds.find("a"));
