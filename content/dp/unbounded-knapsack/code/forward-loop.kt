// 1D unbounded knapsack: capacity SEEDHI chalao. dp[w - wt] mein ye item pehle hi ho sakta hai - aur yahi chahiye (kitni bhi baar)
fun unbounded(wt: IntArray, value: IntArray, cap: Int): Int {
    val dp = IntArray(cap + 1) // dp[w] = jagah w mein max value
    for (i in wt.indices) {
        for (w in wt[i]..cap) dp[w] = maxOf(dp[w], dp[w - wt[i]] + value[i])
    }
    return dp[cap]
}

// Doosra order: capacity bahar, items andar - "aakhri item kaunsa?". Max / min mein dono order ka jawab same
fun unboundedCapFirst(wt: IntArray, value: IntArray, cap: Int): Int {
    val dp = IntArray(cap + 1)
    for (w in 1..cap) {
        for (i in wt.indices) {
            if (wt[i] <= w) dp[w] = maxOf(dp[w], dp[w - wt[i]] + value[i])
        }
    }
    return dp[cap]
}

fun main() {
    val wt = intArrayOf(1, 2, 3, 4, 5)
    val v = intArrayOf(2, 5, 9, 10, 12)
    println("${unbounded(wt, v, 5)} ${unboundedCapFirst(wt, v, 5)}")
    println(unbounded(intArrayOf(2), intArrayOf(3), 6)) // 2kg wala teen baar
}

// Output:
// 14 14
// 9
