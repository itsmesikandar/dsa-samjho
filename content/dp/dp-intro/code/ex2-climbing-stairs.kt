// dp[i] = seedhi i tak pahunchne ke tareeke. Aakhri step ya to 1 ka (i-1 se) ya 2 ka (i-2 se)
fun climbStairs(n: Int): Int {
    val dp = IntArray(n + 1)
    dp[0] = 1 // land par: 1 tareeka (kuch mat karo)
    dp[1] = 1 // ek seedhi: sirf 1 ka step //@base
    for (i in 2..n) {
        dp[i] = dp[i - 1] + dp[i - 2] // dono tarah ke aakhri step alag tareeke hain - jodo //@step
    }
    return dp[n] //@done
}

fun main() {
    println(climbStairs(5))
    println(climbStairs(1))
    println(climbStairs(30))
}

// Output:
// 8
// 1
// 1346269
