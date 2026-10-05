// Sabse lamba lagatar subarray jismein (max - min) <= limit
fun longestSubarray(nums: IntArray, limit: Int): Int {
    val maxD = ArrayDeque<Int>() // values ghatti hui: aage = window ka max
    val minD = ArrayDeque<Int>() // values badhti hui: aage = window ka min
    var l = 0
    var best = 0
    for (r in nums.indices) {
        while (maxD.isNotEmpty() && maxD.last() < nums[r]) maxD.removeLast() //@push
        maxD.addLast(nums[r])
        while (minD.isNotEmpty() && minD.last() > nums[r]) minD.removeLast()
        minD.addLast(nums[r])
        while (maxD.first() - minD.first() > limit) { // window kharab: l se sikodo //@shrink
            if (maxD.first() == nums[l]) maxD.removeFirst() // bahar jaane wala hi max tha
            if (minD.first() == nums[l]) minD.removeFirst() // ya min tha
            l++
        }
        best = maxOf(best, r - l + 1) //@update
    }
    return best
}

fun main() {
    println(longestSubarray(intArrayOf(10, 1, 2, 4, 7, 2), 5))
    println(longestSubarray(intArrayOf(8, 2, 4, 7), 4))
    println(longestSubarray(intArrayOf(4, 2, 2, 2, 4, 4, 2, 2), 0))
}

// Output:
// 4
// 2
// 3
