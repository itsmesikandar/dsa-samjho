import java.util.Collections
import java.util.PriorityQueue

// Har baar 2 sabse bhaari stone collision: max-heap se dono turant milte hain
fun lastStoneWeight(stones: IntArray): Int {
    val pq = PriorityQueue<Int>(Collections.reverseOrder()) // max-heap //@build
    for (s in stones) pq.add(s)
    while (pq.size > 1) {
        val y = pq.poll() // sabse bhaari //@take
        val x = pq.poll() // doosra sabse bhaari
        if (y != x) pq.add(y - x) // bada bacha hua piece wapas //@push
    }
    return if (pq.isEmpty()) 0 else pq.peek() //@end
}

fun main() {
    println(lastStoneWeight(intArrayOf(2, 7, 4, 1, 8, 1)))
    println(lastStoneWeight(intArrayOf(3, 3)))
    println(lastStoneWeight(intArrayOf(1000, 200)))
}

// Output:
// 1
// 0
// 800
