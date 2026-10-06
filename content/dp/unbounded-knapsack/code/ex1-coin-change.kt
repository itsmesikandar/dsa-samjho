// Kam se kam sikke jinse amount bane. Har sikka kitni bhi baar (unbounded). Greedy (bada pehle) galat ho sakta
fun coinChange(coins: IntArray, amount: Int): Int {
    val inf = amount + 1 // itne sikke kabhi nahi lagenge - 'infinity' ki jagah, +1 par overflow bhi nahi
    val dp = IntArray(amount + 1) { inf } // dp[a] = amount a ke kam se kam sikke
    dp[0] = 0 // kuch nahi dena - 0 sikke
    for (a in 1..amount) {
        for (c in coins) {
            if (c <= a) dp[a] = minOf(dp[a], dp[a - c] + 1) // aakhri sikka c: baaki a - c ka best + 1 //@try
        }
    }
    return if (dp[amount] > amount) -1 else dp[amount] //@done
}

fun main() {
    println(coinChange(intArrayOf(1, 3, 4), 6))
    println(coinChange(intArrayOf(2), 3))
    println(coinChange(intArrayOf(5), 0))
}

// Output:
// 2
// -1
// 0
