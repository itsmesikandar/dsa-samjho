import java.util.Collections
import java.util.PriorityQueue

// Har kadam: naya andar, purana bahar, phir balance. Median = tops se
fun medianSlidingWindow(nums: IntArray, k: Int): DoubleArray {
    val left = PriorityQueue<Int>(Collections.reverseOrder()) // window ka chhota aadha
    val right = PriorityQueue<Int>() // window ka bada aadha
    val out = DoubleArray(nums.size - k + 1)
    for (i in nums.indices) {
        if (left.isEmpty() || nums[i] <= left.peek()) left.add(nums[i]) else right.add(nums[i]) // naya andar //@add
        if (i >= k) { // window aage khiski - nums[i - k] bahar
            val old = nums[i - k]
            if (old <= left.peek()) left.remove(old) else right.remove(old) // jis aadhe mein hai wahin se, O(k) //@remove
        }
        if (left.size > right.size + 1) right.add(left.poll()) // sizes theek karo //@fix
        else if (right.size > left.size) left.add(right.poll())
        if (i >= k - 1) { // window poori - median likho //@median
            out[i - k + 1] = if (left.size > right.size) left.peek().toDouble()
            else (left.peek().toLong() + right.peek()) / 2.0
        }
    }
    return out
}

fun main() {
    println(medianSlidingWindow(intArrayOf(5, 2, 8, 1, 9, 3, 7), 3).contentToString())
    println(medianSlidingWindow(intArrayOf(4, 4, 1, 7), 2).contentToString())
    println(medianSlidingWindow(intArrayOf(2147483647, 2147483647), 2).contentToString())
}

// Output:
// [5.0, 2.0, 8.0, 3.0, 7.0]
// [4.0, 2.5, 4.0]
// [2.147483647E9]
