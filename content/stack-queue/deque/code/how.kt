// Size k ki har window (continuous k items) ka maximum - O(n) mein
fun maxSlidingWindow(nums: IntArray, k: Int): IntArray {
    val dq = ArrayDeque<Int>() // INDEXES; inki values aage se peeche GHATTI hui (decreasing)
    val res = IntArray(nums.size - k + 1)
    for (i in nums.indices) {
        if (dq.isNotEmpty() && dq.first() <= i - k) dq.removeFirst() // aage wala window se bahar ho gaya //@drop
        while (dq.isNotEmpty() && nums[dq.last()] <= nums[i]) dq.removeLast() // naya bada aaya: peeche ke chhote ab kabhi max nahi banenge //@pop
        dq.addLast(i) //@push
        if (i >= k - 1) res[i - k + 1] = nums[dq.first()] // aage wala = window ka max //@max
    }
    return res
}

fun main() {
    println(maxSlidingWindow(intArrayOf(1, 3, -1, -3, 5, 3, 6, 7), 3).contentToString())
    println(maxSlidingWindow(intArrayOf(1), 1).contentToString())
}

// Output:
// [3, 3, 5, 5, 6, 7]
// [1]
