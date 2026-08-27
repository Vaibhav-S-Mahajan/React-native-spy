# Graph Coding & Loop Coding Guide

A practical guide to two fundamental coding skills: **loops** (repeating work) and **graphs** (modeling connections). All examples are in JavaScript.

---

## Part 1: Loop Coding

Loops repeat a block of code until a condition is met. Choosing the right loop makes code shorter, clearer, and faster.

### 1.1 The `for` loop — when you know how many times

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

**Anatomy:** `for (initializer; condition; update)`
1. `let i = 0` — runs once at the start
2. `i < 5` — checked before every iteration; loop stops when false
3. `i++` — runs after every iteration

### 1.2 The `while` loop — when you don't know how many times

```javascript
let balance = 100;
while (balance > 0) {
  balance -= 30;
  console.log(balance); // 70, 40, 10, -20
}
```

The loop runs **while the condition is true**. If the condition is false at the start, the body never runs.

### 1.3 The `do...while` loop — run at least once

```javascript
let input;
do {
  input = getUserInput(); // runs at least one time
} while (input !== "quit");
```

### 1.4 Looping over collections

```javascript
const fruits = ["apple", "banana", "cherry"];

// for...of → values (use this for arrays)
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in → keys/indexes (use this for objects)
for (const index in fruits) {
  console.log(index); // "0", "1", "2"
}

// Classic for with index — when you need the position
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}
```

### 1.5 Array method loops (preferred in modern JS)

```javascript
const nums = [1, 2, 3, 4, 5];

nums.forEach(n => console.log(n));        // do something with each
const doubled = nums.map(n => n * 2);     // transform → [2,4,6,8,10]
const evens = nums.filter(n => n % 2 === 0); // pick some → [2,4]
const sum = nums.reduce((acc, n) => acc + n, 0); // combine → 15
const found = nums.find(n => n > 3);      // first match → 4
```

**Rule of thumb:** use `map`/`filter`/`reduce` when transforming data; use `for...of` when you need `break`/`continue` or `await` inside the loop.

### 1.6 `break` and `continue`

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // skip this iteration
  if (i === 7) break;    // exit the loop entirely
  console.log(i);        // 0,1,2,4,5,6
}
```

### 1.7 Nested loops

```javascript
// Print a multiplication grid
for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 3; col++) {
    console.log(`${row} x ${col} = ${row * col}`);
  }
}
```

⚠️ Nested loops over `n` items cost **O(n²)** — fine for small data, slow for large data.

### 1.8 Common loop patterns

```javascript
// Accumulator — build up a result
let total = 0;
for (const price of cart) total += price;

// Search — find and stop
let user = null;
for (const u of users) {
  if (u.id === targetId) { user = u; break; }
}

// Countdown / reverse
for (let i = arr.length - 1; i >= 0; i--) console.log(arr[i]);

// Step by 2 (or any step)
for (let i = 0; i < 100; i += 2) console.log(i);
```

### 1.9 Common mistakes

| Mistake | Example | Fix |
|---|---|---|
| Off-by-one | `i <= arr.length` → crash | use `i < arr.length` |
| Infinite loop | forgetting `i++` | always update the counter |
| Mutating while looping | `arr.splice(i, 1)` inside `for` | loop backwards or use `filter` |
| `await` in `forEach` | doesn't wait! | use `for...of` instead |

```javascript
// ❌ forEach does NOT wait for async calls
urls.forEach(async url => await fetch(url));

// ✅ for...of awaits properly
for (const url of urls) {
  await fetch(url);
}
```

---

## Part 2: Graph Coding

A **graph** is a set of **nodes (vertices)** connected by **edges**. Use graphs whenever your data is about *relationships*: social networks, maps, dependencies, file systems, recommendations.

```
    A ──── B
    │      │
    C ──── D ──── E
```

### 2.1 Graph vocabulary

| Term | Meaning |
|---|---|
| Vertex / Node | A point in the graph (A, B, C…) |
| Edge | A connection between two nodes |
| Directed | Edges have a direction (A → B ≠ B → A) |
| Undirected | Edges go both ways (A — B) |
| Weighted | Edges have a cost (distance, time) |
| Neighbor | A node directly connected to another |
| Path | A sequence of edges from one node to another |
| Cycle | A path that returns to its starting node |

### 2.2 Representing a graph in code

**Adjacency list** (most common — memory efficient):

```javascript
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C", "E"],
  E: ["D"],
};
```

**Adjacency matrix** (fast lookups, heavy memory — good for dense graphs):

```javascript
//     A  B  C  D  E
const matrix = [
  [0, 1, 1, 0, 0], // A
  [1, 0, 0, 1, 0], // B
  [1, 0, 0, 1, 0], // C
  [0, 1, 1, 0, 1], // D
  [0, 0, 0, 1, 0], // E
];
// matrix[A][B] === 1 means "edge exists"
```

**Edge list** (simplest, used as input format):

```javascript
const edges = [["A","B"], ["A","C"], ["B","D"], ["C","D"], ["D","E"]];
```

### 2.3 Building a reusable Graph class

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2) {           // undirected: add both ways
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1);
  }

  getNeighbors(vertex) {
    return this.adjacencyList.get(vertex) ?? [];
  }
}

const g = new Graph();
["A", "B", "C", "D", "E"].forEach(v => g.addVertex(v));
g.addEdge("A", "B");
g.addEdge("A", "C");
g.addEdge("B", "D");
g.addEdge("C", "D");
g.addEdge("D", "E");
```

### 2.4 Breadth-First Search (BFS) — level by level

Explores neighbors first, then neighbors-of-neighbors. Uses a **queue** (FIFO). Best for: **shortest path in unweighted graphs**, "nearest" queries.

```javascript
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();       // dequeue
    order.push(node);

    for (const neighbor of graph.getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);        // mark BEFORE enqueueing
        queue.push(neighbor);
      }
    }
  }
  return order;
}

bfs(g, "A"); // ["A", "B", "C", "D", "E"]
```

**BFS shortest path:**

```javascript
function shortestPath(graph, start, target) {
  const queue = [[start, [start]]];   // [node, pathSoFar]
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [node, path] = queue.shift();
    if (node === target) return path;

    for (const neighbor of graph.getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return null; // no path exists
}

shortestPath(g, "A", "E"); // ["A", "B", "D", "E"]
```

### 2.5 Depth-First Search (DFS) — go deep first

Follows one path as far as it goes, then backtracks. Uses a **stack** (or recursion). Best for: **cycle detection, topological sort, maze solving, exhaustively exploring**.

```javascript
// Recursive version (the call stack IS the stack)
function dfs(graph, node, visited = new Set(), order = []) {
  visited.add(node);
  order.push(node);

  for (const neighbor of graph.getNeighbors(node)) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, order);
    }
  }
  return order;
}

dfs(g, "A"); // ["A", "B", "D", "C", "E"]
```

```javascript
// Iterative version (explicit stack — no recursion limit risk)
function dfsIterative(graph, start) {
  const visited = new Set([start]);
  const stack = [start];
  const order = [];

  while (stack.length > 0) {
    const node = stack.pop();
    order.push(node);

    for (const neighbor of graph.getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  return order;
}
```

### 2.6 BFS vs DFS — which one?

| | BFS | DFS |
|---|---|---|
| Data structure | Queue | Stack / recursion |
| Explores | Level by level | Deep first |
| Shortest path (unweighted) | ✅ Yes | ❌ No |
| Cycle detection | ✅ | ✅ (more natural) |
| Memory | O(width) — can be huge | O(depth) |
| Use when answer is… | near the start | deep in the graph |

### 2.7 Detecting a cycle (directed graph)

```javascript
function hasCycle(graph) {
  const visiting = new Set(); // in current DFS path
  const done = new Set();     // fully explored

  function visit(node) {
    if (done.has(node)) return false;
    if (visiting.has(node)) return true; // back edge → cycle!

    visiting.add(node);
    for (const neighbor of graph.getNeighbors(node)) {
      if (visit(neighbor)) return true;
    }
    visiting.delete(node);
    done.add(node);
    return false;
  }

  for (const node of graph.adjacencyList.keys()) {
    if (visit(node)) return true;
  }
  return false;
}
```

### 2.8 Complexity cheat sheet

| Operation | Adjacency List | Adjacency Matrix |
|---|---|---|
| Add vertex | O(1) | O(V²) |
| Add edge | O(1) | O(1) |
| Check edge exists | O(degree) | O(1) |
| BFS / DFS | O(V + E) | O(V²) |
| Space | O(V + E) | O(V²) |

> **V** = number of vertices, **E** = number of edges. For most real problems (sparse graphs), adjacency list + `O(V + E)` traversal wins.

### 2.9 How loops and graphs work together

Notice every graph algorithm is built from loops:

- **BFS** = a `while` loop over a queue + a `for` loop over neighbors
- **DFS** = recursion (a hidden loop) + a `for` loop over neighbors
- **The `visited` set** is what turns a loop into a *terminating* graph traversal — without it, a cycle makes the loop run forever

```javascript
// The universal graph traversal skeleton:
while (workRemaining) {      // loop
  const node = getNext();    // queue (BFS) or stack (DFS)
  if (visited.has(node)) continue;
  visited.add(node);
  for (const neighbor of node.neighbors) {  // loop
    addToWork(neighbor);
  }
}
```

---

## Practice Problems

**Loops**
1. FizzBuzz — print 1–100, but "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both
2. Reverse an array with a loop (no `.reverse()`)
3. Find the two numbers in an array that sum to a target
4. Flatten a nested array one level deep

**Graphs**
1. Count the number of connected components in a graph
2. Check if a path exists between two nodes
3. Find all nodes within K hops of a start node (BFS with depth tracking)
4. Course schedule: given prerequisites, can you finish all courses? (cycle detection)
5. Clone a graph given a reference to one node

---

## Key Takeaways

1. **Loops**: pick `for...of` for arrays, `map`/`filter`/`reduce` for transformations, `while` when the count is unknown — and never `await` inside `forEach`.
2. **Graphs**: model relationships as an adjacency list, traverse with BFS (shortest path) or DFS (exhaustive search), and always track `visited` nodes.
3. Every graph traversal is just a loop + a worklist + a visited set.
