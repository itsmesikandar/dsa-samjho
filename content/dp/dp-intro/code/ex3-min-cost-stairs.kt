// cost[i] = seedhi i se aage badhne ka cost. Top = n (aakhri seedhi ke paar). Kam se kam cost?
fun minCostClimbingStairs(cost: IntArray): Int {
    val n = cost.size
    val dp = IntArray(n + 1) // dp[i] = seedhi i par KHADE hone ka kam se kam cost
    dp[0] = 0 // 0 ya 1 se shuru kar sakte ho - wahan khade hona free //@base
    dp[1] = 0
    for (i in 2..n) {
        dp[i] = minOf(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]) // i-1 se 1 step, ya i-2 se 2 //@step
    }
    return dp[n] //@done
}

fun main() {
    println(minCostClimbingStairs(intArrayOf(3, 8, 2, 7, 1, 5)))
    println(minCostClimbingStairs(intArrayOf(5, 5)))
}

// Output:
// 6
// 5
