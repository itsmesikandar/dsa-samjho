import java.util.Collections
import java.util.PriorityQueue

// Two heaps ka general form: left mein hamesha "rank" sabse chhote. Left ka top = p-th percentile
fun runningPercentile(nums: IntArray, p: Int): List<Int> {
    val left = PriorityQueue<Int>(Collections.reverseOrder())
    val right = PriorityQueue<Int>()
    val out = mutableListOf<Int>()
    for ((i, x) in nums.withIndex()) {
        if (left.isEmpty() || x <= left.peek()) left.add(x) else right.add(x)
        val rank = (p * (i + 1) + 99) / 100 // ceil(p% of n) - integer math, double nahi
        while (left.size > rank) right.add(left.poll()) // left mein zyada - top right mein
        while (left.size < rank) left.add(right.poll()) // left mein kam - right ka top left mein
        out.add(left.peek())
    }
    return out
}

fun main() {
    val ms = intArrayOf(120, 80, 300, 95, 110, 2000, 90, 105, 100, 130) // API response time (ms)
    println(runningPercentile(ms, 50))
    println(runningPercentile(ms, 90))
}

// Output:
// [120, 80, 120, 95, 110, 110, 110, 105, 105, 105]
// [120, 120, 300, 300, 300, 2000, 2000, 2000, 2000, 300]
