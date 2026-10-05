// Sabse chhota lagatar subarray jiska sum >= k. Numbers NEGATIVE bhi ho sakte hain. Na ho to -1.
fun shortestSubarray(nums: IntArray, k: Int): Int {
    val n = nums.size
    val pre = LongArray(n + 1) // pre[j] - pre[i] = index i..j-1 ka sum
    for (i in 0 until n) pre[i + 1] = pre[i] + nums[i]
    val dq = ArrayDeque<Int>() // start indexes; inke pre values BADHTE hue
    var best = Int.MAX_VALUE
    for (j in 0..n) {
        while (dq.isNotEmpty() && pre[j] - pre[dq.first()] >= k) { // sabse purana start chal gaya - usse chhota kabhi nahi milega //@found
            best = minOf(best, j - dq.removeFirst())
        }
        while (dq.isNotEmpty() && pre[dq.last()] >= pre[j]) dq.removeLast() // j behtar start hai: pre chhota/barabar AUR baad mein //@pop
        dq.addLast(j) //@push
    }
    return if (best == Int.MAX_VALUE) -1 else best
}

fun main() {
    println(shortestSubarray(intArrayOf(2, -1, 2), 3))
    println(shortestSubarray(intArrayOf(1, 2), 4))
    println(shortestSubarray(intArrayOf(84, -37, 32, 40, 95), 167))
}

// Output:
// 3
// -1
// 3
