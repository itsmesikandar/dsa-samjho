// Jitni baar chaho khareedo-becho: har chadhaai (aaj > kal) ka profit jodo
fun maxProfit2(prices: IntArray): Int {
    var profit = 0
    for (i in 1 until prices.size) { //@day
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1] // kal khareeda, aaj becha //@up
    }
    return profit //@done
}

fun main() {
    println(maxProfit2(intArrayOf(7, 2, 5, 1, 6, 4)))
    println(maxProfit2(intArrayOf(1, 2, 3, 4, 5)))
    println(maxProfit2(intArrayOf(9, 7, 4)))
}

// Output:
// 8
// 4
// 0
