// Unbounded knapsack: rod ko pieces mein kaato, har length ka piece KITNI BHI baar. Max profit
// price[k - 1] = length k ke pieces ka price, rod ki length = price.size
fun rodCut(price: IntArray): Int {
    val n = price.size
    val dp = Array(n + 1) { IntArray(n + 1) } // dp[i][w] = length 1..i ke pieces allowed, rod w -> max profit
    for (i in 1..n) {
        for (w in 0..n) {
            dp[i][w] = dp[i - 1][w] // length i ka piece mat kaato //@skip
            if (i <= w) {
                dp[i][w] = maxOf(dp[i][w], dp[i][w - i] + price[i - 1]) // kaato: ISI row se - bachi rod mein i phir kaat sakte //@take
            }
        }
    }
    return dp[n][n] //@done
}

fun main() {
    println(rodCut(intArrayOf(2, 5, 9, 10, 12)))
    println(rodCut(intArrayOf(3, 5, 8, 9)))
}

// Output:
// 14
// 12
