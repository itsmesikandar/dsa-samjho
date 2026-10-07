// Climbing stairs ka general form: allowed step ek set mein. dp[i] = sab s ke liye dp[i - s] ka jod
fun countWays(n: Int, steps: IntArray): Long {
    val dp = LongArray(n + 1)
    dp[0] = 1 // khaali rasta - 1 tareeka
    for (i in 1..n) {
        for (s in steps) {
            if (s <= i) dp[i] += dp[i - s] // aakhri step s ka tha - pehle i - s tak pahunche the
        }
    }
    return dp[n]
}

fun main() {
    println(countWays(4, intArrayOf(1, 2, 3)))
    println(countWays(5, intArrayOf(1, 2))) // climbing stairs hi
    println(countWays(7, intArrayOf(2, 5)))
}

// Output:
// 7
// 8
// 2
