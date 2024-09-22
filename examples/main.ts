import { Heap, Queue, Deque, Trie, DisjointSet, AVLTree } from "../src/index";

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

const avlTree = new AVLTree<number>((x) => x);
avlTree.insert(1);
avlTree.insert(2);
avlTree.insert(3);
avlTree.insert(4);
avlTree.insert(5);
avlTree.insert(6);
avlTree.insert(7);

console.log(avlTree);
