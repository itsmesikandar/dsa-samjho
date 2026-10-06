// LCS: do strings ka sabse lamba common subsequence (order same, beech mein gap allowed)
fun lcs(a: String, b: String): Int {
    val m = a.length
    val n = b.length
    val dp = Array(m + 1) { IntArray(n + 1) } // dp[i][j] = a ke pehle i aur b ke pehle j chars ka LCS; row/col 0 = khaali string
    for (i in 1..m) {
        for (j in 1..n) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1 // dono aakhri chars same - LCS mein le lo //@match
            } else {
                dp[i][j] = maxOf(dp[i - 1][j], dp[i][j - 1]) // a ka aakhri chhodo ya b ka - jo behtar //@skip
            }
        }
    }
    return dp[m][n] //@done
}

fun main() {
    println(lcs("khana", "kahani"))
    println(lcs("abc", "xyz"))
}

// Output:
// 4
// 0
