// Sabse lamba palindromic subsequence. dp[i][j] = s[i..j] ke andar ka jawab. Chhote tukdon se bade (length badhate jao)
fun longestPalindromeSubseq(s: String): Int {
    val n = s.length
    val dp = Array(n) { IntArray(n) }
    for (i in 0 until n) dp[i][i] = 1 // ek akshar khud palindrome //@one
    for (len in 2..n) {
        for (i in 0..n - len) {
            val j = i + len - 1
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2 // dono kinaare same - andar wale ke dono taraf laga do (len 2 par andar 0) //@match
            } else {
                dp[i][j] = maxOf(dp[i + 1][j], dp[i][j - 1]) // ek kinaara chhodo //@skip
            }
        }
    }
    return dp[0][n - 1] //@done
}

fun main() {
    println(longestPalindromeSubseq("tamatar"))
    println(longestPalindromeSubseq("abcd"))
}

// Output:
// 5
// 1
