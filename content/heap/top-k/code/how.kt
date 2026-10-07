import java.util.Collections
import java.util.PriorityQueue

// k sabse chhote: size k ka MAX-heap. Root = andar ka sabse bada = sabse pehle bahar jaane layak
fun kSmallest(nums: IntArray, k: Int): List<Int> {
    val pq = PriorityQueue<Int>(Collections.reverseOrder())
    for (x in nums) {
        if (pq.size < k) pq.add(x) // jagah khaali - seedha andar //@add
        else if (x < pq.peek()) { // andar ke sabse bade se chhota - better candidate //@check
            pq.poll() // sabse bada bahar, naya andar //@swap
            pq.add(x)
        }
    }
    return pq.sorted() // bache k items sort: O(k log k) //@done
}

fun main() {
    println(kSmallest(intArrayOf(7, 2, 9, 4, 1, 8, 3), 3))
    println(kSmallest(intArrayOf(5, 5, 5), 2))
}

// Output:
// [1, 2, 3]
// [5, 5]
