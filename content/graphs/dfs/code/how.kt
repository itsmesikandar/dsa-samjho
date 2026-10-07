// DFS: ek neighbor pakdo aur uski poori depth tak jao; raasta band ho to wapas aao (backtrack)
fun dfs(u: Int, adj: List<List<Int>>, visited: BooleanArray, order: MutableList<Int>) {
    visited[u] = true // aate hi mark //@enter
    order.add(u)
    for (v in adj[u]) {
        if (!visited[v]) dfs(v, adj, visited, order) // naya neighbor - pehle uski poori depth //@go
    }
} // saare neighbor dekh liye - wapas caller ke paas (backtrack) //@back

fun main() {
    val n = 7
    val edges = arrayOf(
        intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 3), intArrayOf(2, 3),
        intArrayOf(2, 4), intArrayOf(3, 5), intArrayOf(4, 6), intArrayOf(5, 6),
    )
    val adj = List(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        adj[u].add(v)
        adj[v].add(u)
    }
    for (start in intArrayOf(0, 6)) {
        val order = mutableListOf<Int>()
        dfs(start, adj, BooleanArray(n), order)
        println(order)
    }
}

// Output:
// [0, 1, 3, 2, 4, 6, 5]
// [6, 4, 2, 0, 1, 3, 5]
