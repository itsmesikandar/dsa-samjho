// Recursion ki jagah apna stack: bahut deep graph (1 lakh nodes ki line) par StackOverflow se bachao
fun dfsIterative(adj: List<List<Int>>, start: Int): List<Int> {
    val visited = BooleanArray(adj.size)
    val order = mutableListOf<Int>()
    val stack = ArrayDeque<Int>()
    stack.addLast(start)
    while (stack.isNotEmpty()) {
        val u = stack.removeLast() // LIFO - sabse naya pehle
        if (visited[u]) continue // ek node stack mein 2 baar aa sakta hai - nikalte time check
        visited[u] = true
        order.add(u)
        for (v in adj[u].asReversed()) { // ulta daalo taaki pehla neighbor sabse upar rahe
            if (!visited[v]) stack.addLast(v)
        }
    }
    return order
}

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
    println(dfsIterative(adj, 0))
    println(dfsIterative(adj, 6))
}

// Output:
// [0, 1, 3, 2, 4, 6, 5]
// [6, 4, 2, 0, 1, 3, 5]
