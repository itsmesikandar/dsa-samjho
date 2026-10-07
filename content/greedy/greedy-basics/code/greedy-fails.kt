// Greedy galat kab? Ek ulta example (counterexample) kaafi hai. Coin change: greedy vs DP
fun greedyCoins(coins: IntArray, amount: Int): Int {
    var left = amount
    var count = 0
    for (c in coins.sortedDescending()) { // hamesha sabse bada coin jo fit ho
        count += left / c
        left %= c
    }
    return if (left == 0) count else -1
}

fun bestCoins(coins: IntArray, amount: Int): Int { // DP: har amount ka sabse kam coins (DP chapter mein detail)
    val dp = IntArray(amount + 1) { Int.MAX_VALUE }
    dp[0] = 0
    for (a in 1..amount) {
        for (c in coins) {
            if (c <= a && dp[a - c] != Int.MAX_VALUE) dp[a] = minOf(dp[a], dp[a - c] + 1)
        }
    }
    return if (dp[amount] == Int.MAX_VALUE) -1 else dp[amount]
}

fun main() {
    val inr = intArrayOf(1, 2, 5, 10)
    println("[1, 2, 5, 10], 18: greedy ${greedyCoins(inr, 18)}, best ${bestCoins(inr, 18)}")
    val odd = intArrayOf(1, 3, 4)
    println("[1, 3, 4], 6: greedy ${greedyCoins(odd, 6)}, best ${bestCoins(odd, 6)}")
}

// Output:
// [1, 2, 5, 10], 18: greedy 4, best 4
// [1, 3, 4], 6: greedy 3, best 2
