// Ek sawaal, chaar tareeke: recursion -> memo -> tabulation -> do variables
var calls = 0L

fun fibPlain(n: Int): Long { // 1. seedhi recursion: O(2^n)
    calls++
    return if (n <= 1) n.toLong() else fibPlain(n - 1) + fibPlain(n - 2)
}

fun fibMemo(n: Int, memo: LongArray): Long { // 2. memo (top-down): O(n)
    if (n <= 1) return n.toLong()
    if (memo[n] == 0L) memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo)
    return memo[n]
}

fun fibTab(n: Int): Long { // 3. tabulation (bottom-up): chhote se bade, O(n) time, O(n) memory
    if (n <= 1) return n.toLong()
    val dp = LongArray(n + 1)
    dp[1] = 1
    for (i in 2..n) dp[i] = dp[i - 1] + dp[i - 2] // pichhle do pehle se bhare hain //@fill
    return dp[n]
}

fun fibTwo(n: Int): Long { // 4. sirf pichhle do chahiye - poora array kyun? O(1) memory
    var a = 0L // fib(i)
    var b = 1L // fib(i + 1)
    repeat(n) {
        val c = a + b
        a = b // khidki ek aage khiski //@slide
        b = c
    }
    return a //@done
}

fun main() {
    val n = 10
    println("tab: ${fibTab(n)}, two vars: ${fibTwo(n)}")
    println("plain: ${fibPlain(n)}, memo: ${fibMemo(n, LongArray(n + 1))}, plain calls: $calls")
}

// Output:
// tab: 55, two vars: 55
// plain: 55, memo: 55, plain calls: 177
