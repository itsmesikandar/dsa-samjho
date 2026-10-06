import java.util.PriorityQueue

// Directed weighted graph: src se dst ka sabse sasta rasta - kharcha aur rasta dono
fun cheapestPath(n: Int, edges: Array<IntArray>, src: Int, dst: Int): String {
    val adj = List(n) { mutableListOf<IntArray>() }
    for ((u, v, w) in edges) adj[u].add(intArrayOf(v, w)) // sirf u → v
    val dist = IntArray(n) { Int.MAX_VALUE }
    val parent = IntArray(n) { -1 } // kis node se sabse sasta aaya
    val pq = PriorityQueue<IntArray>(compareBy { it[1] })
    dist[src] = 0
    pq.add(intArrayOf(src, 0)) //@start
    while (pq.isNotEmpty()) {
        val (u, d) = pq.poll()
        if (d > dist[u]) continue
        if (u == dst) break // dst heap se nikla = uski doori pakki //@found
        for ((v, w) in adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w // sasta rasta mila - parent bhi badlo //@relax
                parent[v] = u
                pq.add(intArrayOf(v, dist[v]))
            }
        }
    }
    if (dist[dst] == Int.MAX_VALUE) return "rasta nahi" //@none
    val path = mutableListOf<Int>()
    var x = dst
    while (x != -1) { // dst se parent pakad ke src tak //@walk
        path.add(x)
        x = parent[x]
    }
    return "${dist[dst]}: ${path.reversed().joinToString(" -> ")}"
}

fun main() {
    val edges = arrayOf(
        intArrayOf(0, 1, 2), intArrayOf(0, 2, 6), intArrayOf(1, 2, 3), intArrayOf(1, 3, 8), intArrayOf(2, 3, 2),
        intArrayOf(2, 4, 7), intArrayOf(3, 4, 1), intArrayOf(3, 5, 6), intArrayOf(4, 5, 2),
    )
    println(cheapestPath(6, edges, 0, 5))
    println(cheapestPath(6, edges, 2, 5))
    println(cheapestPath(6, edges, 5, 0))
}

// Output:
// 10: 0 -> 1 -> 2 -> 3 -> 4 -> 5
// 5: 2 -> 3 -> 4 -> 5
// rasta nahi
