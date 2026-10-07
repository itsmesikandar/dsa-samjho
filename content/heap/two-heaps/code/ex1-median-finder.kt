import java.util.Collections
import java.util.PriorityQueue

// Har number pehle left se pass hota hai - isliye "kis heap mein?" wala if nahi chahiye
class MedianFinder {
    private val left = PriorityQueue<Int>(Collections.reverseOrder()) // chhota aadha (max-heap)
    private val right = PriorityQueue<Int>() // bada aadha (min-heap)

    fun addNum(num: Int) {
        left.add(num) // 1. pehle left mein //@push
        right.add(left.poll()) // 2. left ka sabse bada right mein - order pakka (left <= right) //@move
        if (right.size > left.size) left.add(right.poll()) // 3. size: left = right ya right + 1 //@balance
    }

    fun findMedian(): Double =
        if (left.size > right.size) left.peek().toDouble() // odd: left ka top //@find
        else (left.peek().toLong() + right.peek()) / 2.0 // even: dono tops ka average
}

fun main() {
    val mf = MedianFinder()
    for (x in intArrayOf(6, 10, 2, 6, 5, 0)) mf.addNum(x)
    println(mf.findMedian())
    mf.addNum(6)
    println(mf.findMedian())
}

// Output:
// 5.5
// 6.0
