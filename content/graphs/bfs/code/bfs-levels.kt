// Level by level BFS: har round ki shuruaat mein queue.size = is level ke nodes
fun bfsLevels(adj: List<List<Int>>, start: Int): List<List<Int>> {
    val visited = BooleanArray(adj.size)
    val levels = mutableListOf<List<Int>>()
    val queue = ArrayDeque<Int>()
    queue.addLast(start)
    visited[start] = true
    while (queue.isNotEmpty()) {
        val level = mutableListOf<Int>()
        repeat(queue.size) { // size pehle hi le liya - beech mein daale gaye agle level ke hain
            val u = queue.removeFirst()
            level.add(u)
            for (v in adj[u]) {
                if (!visited[v]) {
                    visited[v] = true
                    queue.addLast(v)
                }
            }
        }
        levels.add(level)
    }
    return levels
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
    val levels = bfsLevels(adj, 0)
    println(levels)
    println("0 se sabse door: ${levels.last()} (${levels.size - 1} kadam)")
}

// Output:
// [[0], [1, 2], [3, 4], [5, 6]]
// 0 se sabse door: [5, 6] (3 kadam)
