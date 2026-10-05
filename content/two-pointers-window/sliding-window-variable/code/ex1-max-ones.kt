// 0/1 array. Zyada se zyada k zeros ko 1 bana sakte ho. Sabse lambi lagatar 1s ki line kitni?
fun longestOnes(nums: IntArray, k: Int): Int {
    var l = 0
    var zeros = 0 // window mein kitne 0 (jinhe flip karna padega)
    var best = 0
    for (r in nums.indices) {
        if (nums[r] == 0) zeros++ //@expand
        while (zeros > k) { // flips kam pad gaye: l se sikodo //@shrink
            if (nums[l] == 0) zeros--
            l++
        }
        best = maxOf(best, r - l + 1) //@update
    }
    return best
}

fun main() {
    println(longestOnes(intArrayOf(1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0), 2))
    println(longestOnes(intArrayOf(0, 0, 0), 0))
}

// Output:
// 6
// 0
