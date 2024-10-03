import {
   Heap,
   Queue,
   Deque,
   Trie,
   DisjointSet,
   BinarySearchTree,
} from "../src/index";

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

const bst = new BinarySearchTree<number>((a, b) => a - b);
bst.insert(1);
bst.insert(2);
bst.insert(3);
bst.insert(4);
bst.insert(5);
bst.insert(6);
bst.insert(7);
bst.delete(4);
bst.delete(5);
bst.delete(6);
bst.delete(7);
console.log(bst);

// const intervalTree = new IntervalTree<[number, number]>((x) => [x[0], x[1]]);
// let ref: [number, number] = [30, 40];
// intervalTree.insert([15, 20]);
// intervalTree.insert([10, 30]);
// intervalTree.insert([5, 20]);
// intervalTree.insert([12, 15]);
// intervalTree.insert([17, 19]);
// intervalTree.insert(ref);

// intervalTree.delete(ref);

// console.log(intervalTree, [...intervalTree.rangeQuery(15, 31)]);
