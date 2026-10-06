// LIS: sabse lamba STRICTLY badhta subsequence. dp[i] = i par KHATAM hone wala sabse lamba
fun lengthOfLIS(nums: IntArray): Int {
    val n = nums.size
    val dp = IntArray(n) { 1 } // har element akela bhi ek chain (length 1) //@init
    for (i in 0 until n) {
        for (j in 0 until i) {
            if (nums[j] < nums[i]) dp[i] = maxOf(dp[i], dp[j] + 1) // j wali chain ke peeche i jod do //@try
        }
    }
    return dp.maxOrNull() ?: 0 // jawab kisi bhi i par khatam ho sakta - isliye max //@done
}

fun main() {
    println(lengthOfLIS(intArrayOf(5, 2, 8, 6, 3, 6, 9, 7)))
    println(lengthOfLIS(intArrayOf(4, 4, 4)))
}

// Output:
// 4
// 1
