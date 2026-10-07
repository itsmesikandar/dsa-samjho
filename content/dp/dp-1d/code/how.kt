// House robber: neighbor 2 ghar ek saath nahi. Har ghar par do hi decision - lo ya chhodo
fun rob(nums: IntArray): Int {
    val n = nums.size
    val dp = IntArray(n + 1) // dp[i] = pehle i gharon (0..i-1) se max paisa
    dp[1] = nums[0] // ek hi ghar - le lo //@base
    for (i in 2..n) {
        dp[i] = maxOf(dp[i - 1], dp[i - 2] + nums[i - 1]) // chhodo: pichhla best; lo: i-2 tak ka best + ye ghar //@choose
    }
    return dp[n] //@done
}

fun main() {
    println(rob(intArrayOf(4, 1, 2, 7, 5, 3, 1)))
    println(rob(intArrayOf(5)))
    println(rob(intArrayOf(2, 1, 1, 2)))
}

// Output:
// 14
// 5
// 4
