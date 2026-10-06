import java.util.PriorityQueue

// Har baar do sabse chhoti rassiyan jodo: jaldi judi rassi ki lambai aage baar baar ginti hai
fun minCost(ropes: IntArray): Long {
    val pq = PriorityQueue<Long>() // min-heap; Long - kharcha bada ho sakta hai //@build
    for (r in ropes) pq.add(r.toLong())
    var cost = 0L
    while (pq.size > 1) {
        val s = pq.poll() + pq.poll() // do sabse chhoti jodo; kharcha = dono ki lambai //@join
        cost += s
        pq.add(s) // nayi rassi wapas - aage ye bhi judegi //@push
    }
    return cost //@end
}

fun main() {
    println(minCost(intArrayOf(4, 3, 2, 6)))
    println(minCost(intArrayOf(1, 2, 3, 4, 5)))
    println(minCost(intArrayOf(10)))
}

// Output:
// 29
// 33
// 0
