import java.util.PriorityQueue

// Size k ka min-heap: k sabse bade andar, unme sabse chhota (root) = kth largest
fun findKthLargest(nums: IntArray, k: Int): Int {
    val pq = PriorityQueue<Int>() // min-heap //@init
    for (x in nums) {
        pq.add(x) // pehle daalo //@add
        if (pq.size > k) pq.poll() // k se zyada - sabse chhota top k mein nahi aa sakta //@trim
    }
    return pq.peek() //@ans
}

fun main() {
    println(findKthLargest(intArrayOf(3, 2, 1, 5, 6, 4), 2))
    println(findKthLargest(intArrayOf(3, 2, 3, 1, 2, 4, 5, 5, 6), 4))
    println(findKthLargest(intArrayOf(-1, -5), 2))
}

// Output:
// 5
// 4
// -5
