// a ko b banao - insert, delete, replace (har ek ka cost 1). Kam se kam kitne operations?
fun minDistance(a: String, b: String): Int {
    val m = a.length
    val n = b.length
    val dp = Array(m + 1) { IntArray(n + 1) } // dp[i][j] = a ke pehle i chars ko b ke pehle j chars banane ka cost
    for (i in 0..m) dp[i][0] = i // b khaali - sab delete //@base
    for (j in 0..n) dp[0][j] = j // a khaali - sab insert
    for (i in 1..m) {
        for (j in 1..n) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] // aakhri chars same - kuch nahi karna //@same
            } else {
                dp[i][j] = 1 + minOf(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) // delete, insert, replace //@op
            }
        }
    }
    return dp[m][n] //@done
}

fun main() {
    println(minDistance("paneer", "pani"))
    println(minDistance("", "abc"))
}

// Output:
// 3
// 3
