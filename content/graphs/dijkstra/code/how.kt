import java.util.PriorityQueue

// Dijkstra: jo abhi sabse paas hai (heap ka top) uski distance pakki; wahan se neighbors ko sasta karo
fun dijkstra(n: Int, edges: Array<IntArray>, src: Int): IntArray {
    val adj = List(n) { mutableListOf<IntArray>() } // (neighbor, weight)
    for ((u, v, w) in edges) {
        adj[u].add(intArrayOf(v, w))
        adj[v].add(intArrayOf(u, w)) // undirected road
    }
    val dist = IntArray(n) { Int.MAX_VALUE }
    val pq = PriorityQueue<IntArray>(compareBy { it[1] }) // (node, dist) - kam dist pehle
    dist[src] = 0
    pq.add(intArrayOf(src, 0)) //@start
    while (pq.isNotEmpty()) {
        val (u, d) = pq.poll() //@poll
        if (d > dist[u]) continue // purani entry - u ka isse sasta dist pehle hi mil chuka //@stale
        for ((v, w) in adj[u]) {
            if (d + w < dist[v]) { // u se hoke v sasta padta hai? //@relax
                dist[v] = d + w //@update
                pq.add(intArrayOf(v, dist[v]))
            }
        }
    }
    return IntArray(n) { if (dist[it] == Int.MAX_VALUE) -1 else dist[it] } // -1 = pahunch nahi //@done
}

fun main() {
    val edges = arrayOf(
        intArrayOf(0, 1, 4), intArrayOf(0, 2, 1), intArrayOf(2, 1, 2), intArrayOf(1, 3, 5),
        intArrayOf(2, 3, 8), intArrayOf(3, 4, 3), intArrayOf(2, 4, 12), intArrayOf(4, 5, 1),
    )
    println(dijkstra(6, edges, 0).contentToString())
    println(dijkstra(4, arrayOf(intArrayOf(0, 1, 3), intArrayOf(2, 3, 1)), 0).contentToString())
}

// Output:
// [0, 3, 1, 8, 11, 12]
// [0, 3, -1, -1]
