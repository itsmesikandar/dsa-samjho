// Kitne combinations (order matter nahi: 1+2 aur 2+1 ek hi) se amount bane. Har coin kitni bhi baar
fun change(amount: Int, coins: IntArray): Int {
    val dp = IntArray(amount + 1) // dp[a] = kitne combinations se amount a
    dp[0] = 1 // kuch na do - ek tareeka
    for (c in coins) { // COINS BAHAR - har combination coins ke ek fixed order mein banta, ek hi baar gina //@coin
        for (a in c..amount) { // seedha - c kitni bhi baar
            dp[a] += dp[a - c] // a - c wale har combination mein ek aur c //@add
        }
    }
    return dp[amount] //@done
}

fun main() {
    println(change(4, intArrayOf(1, 2, 3)))
    println(change(3, intArrayOf(2)))
}

// Output:
// 4
// 0
