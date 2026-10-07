// BFS: queue se level by level - pehle saare 1 step door, phir 2 step door...
fun bfs(adj: List<List<Int>>, start: Int): List<Int> {
    val visited = BooleanArray(adj.size)
    val order = mutableListOf<Int>()
    val queue = ArrayDeque<Int>()
    queue.addLast(start)
    visited[start] = true //@start
    while (queue.isNotEmpty()) {
        val u = queue.removeFirst() // sabse pehle aaya, sabse pehle nikla (FIFO) //@pop
        order.add(u)
        for (v in adj[u]) {
            if (!visited[v]) { // pehli baar dikha? //@check
                visited[v] = true // queue mein DAALTE hi mark - warna 2 baar aa sakta //@mark
                queue.addLast(v)
            }
        }
    }
    return order //@done
}

fun main() {
    val n = 7
    val edges = arrayOf(
        intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 3), intArrayOf(2, 3),
        intArrayOf(2, 4), intArrayOf(3, 5), intArrayOf(4, 6), intArrayOf(5, 6),
    )
    val adj = List(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        adj[u].add(v)
        adj[v].add(u)
    }
    println(bfs(adj, 0))
    println(bfs(adj, 6))
}

// Output:
// [0, 1, 2, 3, 4, 5, 6]
// [6, 4, 5, 2, 3, 0, 1]
