import kotlin.math.abs

// Kruskal: saari edges sasti se mehngi; jo do ALAG groups jode wahi lo. n - 1 edges = sab jude
fun find(parent: IntArray, x: Int): Int {
    if (parent[x] != x) parent[x] = find(parent, parent[x])
    return parent[x]
}

fun minCostConnectPoints(points: Array<IntArray>): Int {
    val n = points.size
    val edges = mutableListOf<IntArray>() // (cost, i, j) - har jodi ek edge
    for (i in 0 until n) {
        for (j in i + 1 until n) {
            val cost = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.add(intArrayOf(cost, i, j))
        }
    }
    edges.sortBy { it[0] } // sasti edge pehle //@sort
    val parent = IntArray(n) { it }
    var total = 0
    var used = 0
    for ((w, i, j) in edges) {
        val ri = find(parent, i)
        val rj = find(parent, j)
        if (ri == rj) continue // pehle se jude - ye edge sirf cycle banayegi //@skip
        parent[rj] = ri
        total += w // ye edge MST mein //@take
        used++
        if (used == n - 1) break // n - 1 edges = sab jud gaye //@done
    }
    return total
}

fun main() {
    val pts = arrayOf(intArrayOf(0, 0), intArrayOf(1, 3), intArrayOf(4, 1), intArrayOf(6, 4), intArrayOf(2, 6))
    println(minCostConnectPoints(pts))
    println(minCostConnectPoints(arrayOf(intArrayOf(1, 1), intArrayOf(4, 5))))
    println(minCostConnectPoints(arrayOf(intArrayOf(3, 3))))
}

// Output:
// 18
// 7
// 0
