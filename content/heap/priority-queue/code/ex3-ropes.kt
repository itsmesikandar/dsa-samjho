import java.util.PriorityQueue

// Har baar 2 sabse chhoti ropes jodo: jaldi judi rope ki length aage baar baar count hai
fun minCost(ropes: IntArray): Long {
    val pq = PriorityQueue<Long>() // min-heap; Long - cost bada ho sakta hai //@build
    for (r in ropes) pq.add(r.toLong())
    var cost = 0L
    while (pq.size > 1) {
        val s = pq.poll() + pq.poll() // 2 sabse chhoti jodo; cost = dono ki length //@join
        cost += s
        pq.add(s) // nayi rope wapas - aage ye bhi judegi //@push
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
