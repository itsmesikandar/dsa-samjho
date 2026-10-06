// dp[i] = pehle i digits ko letters mein todne ke tareeke. Aakhri letter 1 digit ka ya 2 digit ka
fun numDecodings(s: String): Int {
    val n = s.length
    val dp = IntArray(n + 1)
    dp[0] = 1 // khaali string: 1 tareeka //@base
    for (i in 1..n) {
        if (s[i - 1] != '0') dp[i] += dp[i - 1] // aakhri ek digit (1-9) akela letter //@one
        if (i >= 2) {
            val two = (s[i - 2] - '0') * 10 + (s[i - 1] - '0')
            if (two in 10..26) dp[i] += dp[i - 2] // aakhri do digit (10-26) ek letter //@two
        }
    }
    return dp[n] //@done
}

fun main() {
    println(numDecodings("12102"))
    println(numDecodings("06"))
    println(numDecodings("2611"))
}

// Output:
// 2
// 0
// 4
