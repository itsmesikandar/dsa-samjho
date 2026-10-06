import java.util.Collections
import java.util.PriorityQueue

// Running median: chhota aadha MAX-heap (left), bada aadha MIN-heap (right). Median = tops se
fun runningMedian(nums: IntArray): List<Double> {
    val left = PriorityQueue<Int>(Collections.reverseOrder()) // chhote numbers - top = unme sabse bada //@init
    val right = PriorityQueue<Int>() // bade numbers - top = unme sabse chhota
    val out = mutableListOf<Double>()
    for (x in nums) {
        if (left.isEmpty() || x <= left.peek()) left.add(x) // left ke top se chhota/barabar - chhote aadhe ka //@toL
        else right.add(x) // warna bade aadhe ka //@toR
        if (left.size > right.size + 1) right.add(left.poll()) // left 2 aage - uska top right mein //@fixL
        else if (right.size > left.size) left.add(right.poll()) // right aage - uska top left mein //@fixR
        val m = if (left.size > right.size) left.peek().toDouble() // odd: beech wala = left ka top //@median
        else (left.peek().toLong() + right.peek()) / 2.0 // even: dono tops ka average (Long - overflow nahi)
        out.add(m)
    }
    return out
}

fun main() {
    println(runningMedian(intArrayOf(5, 15, 1, 3, 8)))
    println(runningMedian(intArrayOf(2, 2, 2)))
    println(runningMedian(intArrayOf(-4, 6)))
}

// Output:
// [5.0, 10.0, 5.0, 4.0, 5.0]
// [2.0, 2.0, 2.0]
// [-4.0, 1.0]
