// Undirected cycle: DFS mein koi visited padosi mila jo parent NAHI hai - matlab doosre raste se pahunch gaye
fun hasCycleFrom(u: Int, parent: Int, adj: List<List<Int>>, visited: BooleanArray): Boolean {
    visited[u] = true //@enter
    for (v in adj[u]) {
        if (v == parent) continue // jis edge se aaye usi se wapas jaana cycle nahi //@parent
        if (visited[v]) return true // pehle dekha node, doosre raste se mila - cycle! //@cycle
        if (hasCycleFrom(v, u, adj, visited)) return true //@go
    }
    return false //@back
}

fun hasCycle(n: Int, edges: Array<IntArray>): Boolean {
    val adj = List(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        adj[u].add(v)
        adj[v].add(u)
    }
    val visited = BooleanArray(n)
    for (s in 0 until n) {
        if (!visited[s] && hasCycleFrom(s, -1, adj, visited)) return true // har component alag check //@start
    }
    return false //@none
}

fun main() {
    val edges = arrayOf(
        intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(1, 3), intArrayOf(3, 4),
        intArrayOf(4, 5), intArrayOf(5, 3), intArrayOf(2, 6),
    )
    println(hasCycle(7, edges))
    println(hasCycle(5, arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(2, 3), intArrayOf(3, 4))))
    println(hasCycle(6, arrayOf(intArrayOf(0, 1), intArrayOf(2, 3), intArrayOf(3, 4), intArrayOf(4, 2))))
}

// Output:
// true
// false
// true
