// [course, pre] = pehle pre, phir course -> edge pre -> course. Sab course free ho paaye? (cycle nahi?)
fun canFinish(numCourses: Int, prerequisites: Array<IntArray>): Boolean {
    val adj = List(numCourses) { mutableListOf<Int>() }
    val indeg = IntArray(numCourses)
    for ((course, pre) in prerequisites) {
        adj[pre].add(course) // dhyaan: pre -> course, ulta nahi //@build
        indeg[course]++
    }
    val queue = ArrayDeque<Int>()
    for (c in 0 until numCourses) if (indeg[c] == 0) queue.addLast(c) //@ready
    var done = 0
    while (queue.isNotEmpty()) {
        val c = queue.removeFirst()
        done++ // c padh liya //@take
        for (next in adj[c]) {
            if (--indeg[next] == 0) queue.addLast(next) // next ke saare pre ho gaye //@free
        }
    }
    return done == numCourses // koi course kabhi free nahi hua = cycle mein phansa //@check
}

fun main() {
    println(canFinish(4, arrayOf(intArrayOf(1, 0), intArrayOf(2, 0), intArrayOf(3, 1), intArrayOf(3, 2))))
    println(canFinish(2, arrayOf(intArrayOf(0, 1), intArrayOf(1, 0))))
    println(canFinish(3, arrayOf()))
}

// Output:
// true
// false
// true
