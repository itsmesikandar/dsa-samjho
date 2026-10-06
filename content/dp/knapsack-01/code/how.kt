// 0/1 knapsack: har item ya poora lo ya chhodo (ek hi baar). Bag ki capacity ke andar max value
fun knapsack(wt: IntArray, value: IntArray, cap: Int): Int {
    val n = wt.size
    val dp = Array(n + 1) { IntArray(cap + 1) } // dp[i][w] = pehle i items, capacity w -> max value
    for (i in 1..n) {
        for (w in 0..cap) {
            dp[i][w] = dp[i - 1][w] // item i-1 chhodo: pichhle items ka hi best //@skip
            if (wt[i - 1] <= w) {
                dp[i][w] = maxOf(dp[i][w], dp[i - 1][w - wt[i - 1]] + value[i - 1]) // lo: bachi jagah mein pichhle items ka best + iski value //@take
            }
        }
    }
    return dp[n][cap] //@done
}

fun main() {
    println(knapsack(intArrayOf(1, 3, 4, 5), intArrayOf(1, 4, 5, 7), 7))
    println(knapsack(intArrayOf(2), intArrayOf(10), 1))
}

// Output:
// 9
// 0
