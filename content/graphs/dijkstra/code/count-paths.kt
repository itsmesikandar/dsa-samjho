import java.util.PriorityQueue

// 0 se n-1 tak kitne alag SABSE SASTE raste? Dijkstra + ways[] (barabar sasta = ways jodo)
fun countPaths(n: Int, roads: Array<IntArray>): Int {
    val mod = 1_000_000_007L
    val adj = List(n) { mutableListOf<IntArray>() }
    for ((u, v, w) in roads) {
        adj[u].add(intArrayOf(v, w))
        adj[v].add(intArrayOf(u, w))
    }
    val dist = LongArray(n) { Long.MAX_VALUE } // bade weights - Long
    val ways = LongArray(n)
    val pq = PriorityQueue<LongArray>(compareBy { it[1] })
    dist[0] = 0
    ways[0] = 1
    pq.add(longArrayOf(0, 0))
    while (pq.isNotEmpty()) {
        val (uL, d) = pq.poll()
        val u = uL.toInt()
        if (d > dist[u]) continue
        for ((v, w) in adj[u]) {
            val nd = d + w
            if (nd < dist[v]) { // naya, aur sasta rasta - purane ways bekaar
                dist[v] = nd
                ways[v] = ways[u]
                pq.add(longArrayOf(v.toLong(), nd))
            } else if (nd == dist[v]) { // utna hi sasta doosra rasta - ways jodo
                ways[v] = (ways[v] + ways[u]) % mod
            }
        }
    }
    return ways[n - 1].toInt()
}

fun main() {
    println(countPaths(4, arrayOf(intArrayOf(0, 1, 1), intArrayOf(0, 2, 1), intArrayOf(1, 3, 1), intArrayOf(2, 3, 1))))
    val roads = arrayOf(
        intArrayOf(0, 1, 2), intArrayOf(0, 2, 1), intArrayOf(2, 1, 1),
        intArrayOf(1, 4, 3), intArrayOf(2, 3, 2), intArrayOf(3, 4, 2),
    )
    println(countPaths(5, roads))
}

// Output:
// 2
// 3
