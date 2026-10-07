// Edge list se adjacency list: har node ki apni padosi-list
fun buildAdj(n: Int, edges: Array<IntArray>, directed: Boolean): List<List<Int>> {
    val adj = List(n) { mutableListOf<Int>() } // n khaali lists - har node ke liye ek //@init
    for ((u, v) in edges) {
        adj[u].add(v) // u se v tak rasta //@uv
        if (!directed) adj[v].add(u) // undirected: v se u bhi //@vu
    }
    return adj //@done
}

fun main() {
    val edges = arrayOf(intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 2), intArrayOf(1, 3), intArrayOf(3, 4), intArrayOf(4, 5))
    println(buildAdj(6, edges, false))
    println(buildAdj(6, edges, true))
    val adj = buildAdj(6, edges, false)
    println("1 ke neighbor: ${adj[1]}, degree ${adj[1].size}")
}

// Output:
// [[1, 2], [0, 2, 3], [0, 1], [1, 4], [3, 5], [4]]
// [[1, 2], [2, 3], [], [4], [5], []]
// 1 ke neighbor: [0, 2, 3], degree 3
