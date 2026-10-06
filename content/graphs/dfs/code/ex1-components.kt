// Har naya (unvisited) node = naya component. Ek DFS us poore component ko visited kar deta hai
fun fill(u: Int, adj: List<List<Int>>, visited: BooleanArray) {
    visited[u] = true
    for (v in adj[u]) if (!visited[v]) fill(v, adj, visited)
}

fun countComponents(n: Int, edges: Array<IntArray>): Int {
    val adj = List(n) { mutableListOf<Int>() }
    for ((u, v) in edges) {
        adj[u].add(v)
        adj[v].add(u)
    }
    val visited = BooleanArray(n)
    var count = 0
    for (s in 0 until n) {
        if (visited[s]) continue // kisi pichhle DFS ne pehle hi chhua - purana component //@skip
        count++ // koi DFS yahan nahi pahuncha - naya component //@new
        fill(s, adj, visited) // poora component ek baar mein //@fill
    }
    return count //@done
}

fun main() {
    println(countComponents(7, arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(0, 2), intArrayOf(3, 4), intArrayOf(5, 3))))
    println(countComponents(5, arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(2, 3), intArrayOf(3, 4))))
    println(countComponents(3, arrayOf()))
}

// Output:
// 3
// 1
// 3
