// Upar-baayein se neeche-daayein, sirf neeche ya daayein chalo. dp[i][j] = (i, j) tak pahunchne ke raste
fun uniquePaths(m: Int, n: Int): Int {
    val dp = Array(m) { IntArray(n) }
    for (i in 0 until m) dp[i][0] = 1 // pehla column: sirf neeche neeche - ek hi rasta //@edge
    for (j in 0 until n) dp[0][j] = 1 // pehli row: sirf daayein daayein
    for (i in 1 until m) {
        for (j in 1 until n) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1] // aakhri kadam: upar se aaye ya baayein se //@cell
        }
    }
    return dp[m - 1][n - 1] //@done
}

fun main() {
    println(uniquePaths(3, 4))
    println(uniquePaths(1, 5))
    println(uniquePaths(10, 10))
}

// Output:
// 10
// 1
// 48620
