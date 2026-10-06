// Kahn's algorithm: jiska koi intezaar nahi (in-degree 0) wahi abhi ho sakta hai
fun topoSort(n: Int, edges: Array<IntArray>): List<Int> {
    val adj = List(n) { mutableListOf<Int>() }
    val indeg = IntArray(n)
    for ((u, v) in edges) {
        adj[u].add(v) // u → v: pehle u, phir v //@build
        indeg[v]++ // v ko ek aur cheez ka intezaar
    }
    val queue = ArrayDeque<Int>()
    for (v in 0 until n) if (indeg[v] == 0) queue.addLast(v) // koi intezaar nahi - abhi ho sakte //@ready
    val order = mutableListOf<Int>()
    while (queue.isNotEmpty()) {
        val u = queue.removeFirst() //@take
        order.add(u)
        for (v in adj[u]) {
            indeg[v]-- // u ho gaya - v ka ek intezaar kam //@dec
            if (indeg[v] == 0) queue.addLast(v) // ab v ka koi intezaar nahi //@free
        }
    }
    return if (order.size == n) order else emptyList() // kuch nodes kabhi free nahi hue = cycle //@check
}

fun main() {
    val edges = arrayOf(intArrayOf(0, 1), intArrayOf(0, 2), intArrayOf(1, 3), intArrayOf(2, 3), intArrayOf(3, 4), intArrayOf(5, 4))
    println(topoSort(6, edges))
    println(topoSort(3, arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(2, 0))))
}

// Output:
// [0, 5, 1, 2, 3, 4]
// []
