// Sabse lambi lagatar (consecutive) numbers ki sequence - O(n), bina sort
fun longestConsecutive(nums: IntArray): Int {
    val set = nums.toHashSet() //@build
    var best = 0
    for (x in set) {
        if (x - 1 in set) continue // x se pehle wala hai -> x shuruaat nahi, skip //@skip
        var len = 1
        while (x + len in set) len++ // shuruaat se aage ginte jao //@count
        best = maxOf(best, len) //@best
    }
    return best
}

fun main() {
    println(longestConsecutive(intArrayOf(100, 4, 200, 1, 3, 2))) // 1, 2, 3, 4
    println(longestConsecutive(intArrayOf(0, 3, 7, 2, 5, 8, 4, 6, 0, 1))) // 0..8
}

// Output:
// 4
// 9
