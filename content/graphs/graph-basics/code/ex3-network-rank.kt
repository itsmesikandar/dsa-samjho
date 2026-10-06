// Pair (a, b) ka rank = a ki roads + b ki roads; a-b seedhi road ho to wo ek hi baar gino
fun maximalNetworkRank(n: Int, roads: Array<IntArray>): Int {
    val deg = IntArray(n)
    val connected = Array(n) { BooleanArray(n) } // adjacency matrix: "a-b road hai?" O(1) mein //@init
    for ((a, b) in roads) {
        deg[a]++ //@deg
        deg[b]++
        connected[a][b] = true
        connected[b][a] = true
    }
    var best = 0
    for (a in 0 until n) {
        for (b in a + 1 until n) {
            var rank = deg[a] + deg[b] // dono ki roads jodo //@pair
            if (connected[a][b]) rank-- // a-b wali road dono degree mein gini gayi - ek ghatao //@minus
            best = maxOf(best, rank)
        }
    }
    return best //@done
}

fun main() {
    val roads = arrayOf(intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(0, 3), intArrayOf(1, 2), intArrayOf(1, 4), intArrayOf(3, 5))
    println(maximalNetworkRank(6, roads))
    println(maximalNetworkRank(4, arrayOf(intArrayOf(0, 1), intArrayOf(0, 3), intArrayOf(1, 2), intArrayOf(1, 3))))
    println(maximalNetworkRank(3, arrayOf()))
}

// Output:
// 5
// 4
// 0
