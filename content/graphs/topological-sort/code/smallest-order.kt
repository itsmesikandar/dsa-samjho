import java.util.PriorityQueue

// Kahn + min-heap: free nodes mein hamesha sabse chhota pehle -> sabse chhota (lexicographic) topological order
fun smallestTopo(n: Int, edges: Array<IntArray>): List<Int> {
    val adj = List(n) { mutableListOf<Int>() }
    val indeg = IntArray(n)
    for ((u, v) in edges) {
        adj[u].add(v)
        indeg[v]++
    }
    val pq = PriorityQueue<Int>() // queue ki jagah heap
    for (v in 0 until n) if (indeg[v] == 0) pq.add(v)
    val order = mutableListOf<Int>()
    while (pq.isNotEmpty()) {
        val u = pq.poll()
        order.add(u)
        for (v in adj[u]) if (--indeg[v] == 0) pq.add(v)
    }
    return if (order.size == n) order else emptyList()
}

fun main() {
    val edges = arrayOf(intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 3), intArrayOf(2, 3), intArrayOf(3, 4), intArrayOf(5, 4))
    println(smallestTopo(6, edges)) // queue wala Kahn: [0, 5, 1, 2, 3, 4]
    println(smallestTopo(3, arrayOf(intArrayOf(2, 0), intArrayOf(1, 0))))
}

// Output:
// [0, 1, 2, 3, 5, 4]
// [1, 2, 0]
