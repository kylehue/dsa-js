# dsa-js

**dsa-js** is a JavaScript library that provides a collection of reusable data structures.

## Table of Contents
- [dsa-js](#dsa-js)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [LinkedList](#linkedlist)
  - [Queue](#queue)
  - [Deque](#deque)
  - [Heap](#heap)
  - [DisjointSet](#disjointset)
  - [Trie](#trie)
  - [Quadtree](#quadtree)
  - [Contributing](#contributing)

## Installation

You can install **dsa-js** using npm:

```bash
npm install dsa-js
```

## LinkedList
```ts
import { LinkedList } from "dsa-js";

let list = new LinkedList<number>();

// Or create a linked list from an array
list = LinkedList.fromArray([1, 2, 3]);

// Adds a node to the end of the list
let node = list.append(4);

// Adds a node to the start of the list
let node = list.prepend(4);

// Removes a node from the list
list.deleteNode(node);

// Adds a node after a specific node
let newNodeAfter = list.insertAfter(node, 5);

// Adds a node before a specific node
let newNodeBefore = list.insertBefore(node, 0);

// Finds a node by value
let foundNode = list.find(3);

// Clones the linked list
let clone = list.clone();

// Removes all nodes from the list
list.clear();

// Get the number of nodes in the list
let size = list.size();

// Check if the list is empty
let isEmpty = list.isEmpty();

// Convert the list to an array
let array = list.toArray();

// Get the head node
let headNode = list.head();

// Get the tail node
let tailNode = list.tail();

// Iterate through the linked list
for (let node of list) {
   console.log(node.value);
}

// Create a node
let node = LinkedList.createNode(5);
```

## Queue
```ts
import { Queue } from "dsa-js";

let queue = new Queue<number>();

// Or create a queue like this:
queue = Queue.fromArray([1, 2, 3]);

// Adds an item in the back
queue.enqueue(2);

// Removes an item in front
let front = queue.dequeue();

// Get the size of the queue
let size = queue.size();

// Clears the queue
queue.clear(); 

// Check if queue is empty
let isEmpty = queue.isEmpty(); 

// Peek the front element
let front = queue.front();

// Peek the back element
let back = queue.back();

// Clones the queue
let clone = queue.clone();

// Convert the queue to array
let array = queue.toArray();

// Iterate through the queue
for (let item of queue) {
   console.log(item);
}
```

## Deque
Deque or Double-Ended Queue is similar to queue except that you can add an element in front and dequeue from the back. It extends the [Queue](#queue) data structure.
```ts
import { Deque } from "dsa-js";

const deque = new Deque<number>();

// Adds an item in front
deque.enqueueFront(2);

// Removes an item in the back
deque.dequeueBack();
```

## Heap
```ts
import { Heap } from "dsa-js";

let heap = new Heap<number>();

// Or create a heap with a custom comparator
heap = new Heap<number>((a, b) => b - a); // Max-heap

// Or create a heap from an array
heap = Heap.fromArray([4, 2, 7, 1]);

// Or create a max heap from an array
heap = Heap.fromArray([4, 2, 7, 1], (a, b) => b - a);

// Get the size of the heap
let size = heap.size();

// Check if the heap is empty
let isEmpty = heap.isEmpty();

// Peek at the top element
let top = heap.peek();

// Add elements to the heap
heap.push(5, 3, 8, 1);

// Remove the top element
let top = heap.pop();

// Clears the heap
heap.clear();

// Clone the heap
let clone = heap.clone();

// Convert the heap to an array
let array = heap.toArray();
```

## DisjointSet
```ts
import { DisjointSet } from "dsa-js";

let ds = new DisjointSet<number>();

// Add nodes to the disjoint set
ds.add(1);
ds.add(2);
ds.add(3);

// Find the root of the set containing a node
let root = ds.find(2);

// Find or add a node to the disjoint set
let root = ds.findOrAdd(4);

// Union two sets containing the specified nodes
let isAlreadyUnified = ds.union(1, 3);
```

## Trie
```ts
import { Trie } from "dsa-js";

// Create a new trie
let trie = new Trie();

// Insert words into the trie
trie.insert("apple");
trie.insert("app");

// Search for a word in the trie
let isFound = trie.search("app");

// Check if any word starts with the given prefix
let startsWith = trie.startsWith("ap");

// Delete a word from the trie
let isDeleted = trie.delete("apple");

// Get all words in the trie
let words = trie.getAllWords();

// Check if the trie is empty
let isEmpty = trie.isEmpty();

// Clear all words from the trie
trie.clear();

// Find the longest prefix of the given word that exists in the trie
let longestPrefix = trie.longestPrefixMatch("applepie");

// Autocomplete words with a given prefix
let suggestions = trie.autocomplete("app");
```

## Quadtree
```ts
import { Quadtree } from "dsa-js";

// Create a new quadtree with specified bounds and configuration
let bounds = { x: 0, y: 0, width: 100, height: 100 };
let config = { maxDepth: 5 };
let quadtree = new Quadtree(bounds, config);

// Insert an item into the quadtree
let item = { x: 10, y: 10, width: 5, height: 5 };
quadtree.insert(item);

// Retrieve all objects within specified bounds
let searchBounds = { x: 5, y: 5, width: 20, height: 20 };
let retrievedItems = quadtree.retrieve(searchBounds);
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue if you have any ideas, improvements, or suggestions.