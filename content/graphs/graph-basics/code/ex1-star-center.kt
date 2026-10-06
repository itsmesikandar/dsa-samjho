// Degree tareeka (koi bhi graph): star mein center ka degree n - 1, baaki sab ka 1
fun findCenterByDegree(edges: Array<IntArray>): Int {
    val n = edges.size + 1 // star mein n - 1 edges
    val deg = IntArray(n + 1) // nodes 1..n, index 0 khaali
    for ((u, v) in edges) {
        deg[u]++ //@deg
        deg[v]++
    }
    return (1..n).first { deg[it] == n - 1 } //@pick
}

// Shortcut: center HAR edge mein hai - to pehli do edges ka common node hi center. O(1)
fun findCenter(edges: Array<IntArray>): Int {
    val (a, b) = edges[0] //@first
    val (c, d) = edges[1] //@second
    return if (a == c || a == d) a else b // a dono mein - wahi center; warna b //@common
}

fun main() {
    val edges = arrayOf(intArrayOf(1, 2), intArrayOf(2, 3), intArrayOf(4, 2))
    println(findCenter(edges))
    println(findCenterByDegree(edges))
    println(findCenter(arrayOf(intArrayOf(5, 1), intArrayOf(1, 3), intArrayOf(4, 1), intArrayOf(1, 2))))
}

// Output:
// 2
// 2
// 1
