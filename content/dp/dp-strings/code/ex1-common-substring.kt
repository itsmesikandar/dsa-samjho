// Sabse lamba common SUBSTRING (continuous, gap nahi). LCS jaisa table, par mismatch par 0 - chain toot gaya
fun longestCommonSubstr(a: String, b: String): Int {
    val dp = Array(a.length + 1) { IntArray(b.length + 1) } // dp[i][j] = a[i-1] aur b[j-1] par KHATAM hone wala common substring
    var best = 0
    for (i in 1..a.length) {
        for (j in 1..b.length) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1 // pichhla common hissa ek aur lamba //@match
                best = maxOf(best, dp[i][j])
            } else {
                dp[i][j] = 0 // yahan khatam hone wala koi common substring nahi //@reset
            }
        }
    }
    return best // jawab kisi bhi cell mein ho sakta, sirf aakhri mein nahi //@done
}

fun main() {
    println(longestCommonSubstr("pakoda", "pakora"))
    println(longestCommonSubstr("abc", "xyz"))
}

// Output:
// 4
// 0
