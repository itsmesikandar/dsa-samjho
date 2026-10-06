// Unweighted graph mein s se t ka sabse chhota rasta: BFS + parent array
fun shortestPath(n: Int, edges: Array<IntArray>, s: Int, t: Int): List<Int> {
    val adj = List(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        adj[u].add(v)
        adj[v].add(u)
    }
    val dist = IntArray(n) { -1 } // -1 = abhi tak nahi pahunche (visited ka kaam bhi yahi)
    val parent = IntArray(n) { -1 } // kis node se pehli baar yahan aaye
    val queue = ArrayDeque<Int>()
    dist[s] = 0
    queue.addLast(s) //@start
    while (queue.isNotEmpty()) {
        val u = queue.removeFirst() //@pop
        if (u == t) break // t nikal gaya - iski dist pakki, aage dhoondhna bekaar //@found
        for (v in adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1 // ek kadam aur //@relax
                parent[v] = u
                queue.addLast(v)
            }
        }
    }
    if (dist[t] == -1) return emptyList() // t tak koi rasta nahi //@none
    val path = mutableListOf<Int>()
    var x = t
    while (x != -1) { // t se parent pakad ke s tak ulta chalo //@walk
        path.add(x)
        x = parent[x]
    }
    return path.reversed()
}

fun main() {
    val edges = arrayOf(
        intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 3), intArrayOf(2, 3),
        intArrayOf(2, 4), intArrayOf(3, 5), intArrayOf(4, 6), intArrayOf(5, 6),
    )
    println(shortestPath(7, edges, 0, 6))
    println(shortestPath(7, edges, 1, 4))
    println(shortestPath(4, arrayOf(intArrayOf(0, 1), intArrayOf(2, 3)), 0, 3))
}

// Output:
// [0, 2, 4, 6]
// [1, 0, 2, 4]
// []
