// 1D knapsack: dp[w] mein abhi pichhle items ka best hai. Capacity ULTI chalao - dp[w - wt] abhi purana (is item se pehle ka)
// Seedhi chalao to dp[w - wt] mein ye item pehle hi jud chuka - ek item kai baar (ye unbounded ho gaya)
fun knap1D(wt: IntArray, value: IntArray, cap: Int, reverse: Boolean): Int {
    val dp = IntArray(cap + 1)
    for (i in wt.indices) {
        val ws = if (reverse) cap downTo wt[i] else wt[i]..cap
        for (w in ws) dp[w] = maxOf(dp[w], dp[w - wt[i]] + value[i])
    }
    return dp[cap]
}

fun main() {
    val wt = intArrayOf(2)
    val v = intArrayOf(3)
    println("ulta (0/1): ${knap1D(wt, v, 6, true)}, seedha (galti se 3 baar): ${knap1D(wt, v, 6, false)}")
    println(knap1D(intArrayOf(1, 3, 4, 5), intArrayOf(1, 4, 5, 7), 7, true))
}

// Output:
// ulta (0/1): 3, seedha (galti se 3 baar): 9
// 9
