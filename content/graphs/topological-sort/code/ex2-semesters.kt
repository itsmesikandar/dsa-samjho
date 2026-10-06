// Ek semester mein jitne chaho course (jinke pre ho chuke). Kahn level by level: ek level = ek semester
fun minSemesters(n: Int, relations: Array<IntArray>): Int {
    val adj = List(n) { mutableListOf<Int>() }
    val indeg = IntArray(n)
    for ((prev, next) in relations) {
        adj[prev].add(next)
        indeg[next]++
    }
    val queue = ArrayDeque<Int>()
    for (c in 0 until n) if (indeg[c] == 0) queue.addLast(c) // pehle semester ke course //@ready
    var semesters = 0
    var done = 0
    while (queue.isNotEmpty()) {
        semesters++ // queue mein abhi jitne hain, sab isi semester //@sem
        repeat(queue.size) {
            val c = queue.removeFirst()
            done++
            for (nx in adj[c]) {
                if (--indeg[nx] == 0) queue.addLast(nx) // agle semester mein ho sakta //@free
            }
        }
    }
    return if (done == n) semesters else -1 // cycle - kuch course kabhi nahi ho sakte //@check
}

fun main() {
    val rel = arrayOf(intArrayOf(0, 2), intArrayOf(1, 2), intArrayOf(2, 3), intArrayOf(2, 4), intArrayOf(3, 5), intArrayOf(4, 5))
    println(minSemesters(7, rel))
    println(minSemesters(3, arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(2, 1))))
    println(minSemesters(3, arrayOf()))
}

// Output:
// 4
// -1
// 1
