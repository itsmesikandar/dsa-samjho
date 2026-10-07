// Ek hi weighted directed graph - matrix aur list dono mein
fun main() {
    val n = 4
    val edges = arrayOf(intArrayOf(0, 1, 5), intArrayOf(0, 2, 3), intArrayOf(2, 1, 1), intArrayOf(1, 3, 2)) // (from, to, weight)

    // 1. Adjacency matrix: mat[u][v] = weight, 0 = edge nahi. Memory n * n
    val mat = Array(n) { IntArray(n) }
    for ((u, v, w) in edges) mat[u][v] = w
    for (row in mat) println(row.contentToString())

    // 2. Adjacency list: har node ke (neighbor, weight) pairs. Memory n + m
    val adj = List(n) { mutableListOf<Pair<Int, Int>>() }
    for ((u, v, w) in edges) adj[u].add(v to w)
    for (u in 0 until n) println("$u -> ${adj[u]}")

    // 3. "u se v edge hai?" - matrix O(1), list O(degree)
    println("0->1: ${mat[0][1] != 0}, 1->0: ${adj[1].any { it.first == 0 }}")
}

// Output:
// [0, 5, 3, 0]
// [0, 0, 0, 2]
// [0, 1, 0, 0]
// [0, 0, 0, 0]
// 0 -> [(1, 5), (2, 3)]
// 1 -> [(3, 2)]
// 2 -> [(1, 1)]
// 3 -> []
// 0->1: true, 1->0: false
