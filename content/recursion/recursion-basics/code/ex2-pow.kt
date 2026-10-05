// x ki power n (n negative bhi ho sakta hai)
fun myPow(x: Double, n: Int): Double {
    var e = n.toLong() // Int.MIN_VALUE ko positive karo to Int overflow - isliye Long
    var b = x
    if (e < 0) { // x^(-n) = (1/x)^n
        b = 1 / b
        e = -e
    }
    return fastPow(b, e)
}

// x^n = (x^(n/2))^2, odd n par ek x aur. Har call n aadha: O(log n)
fun fastPow(x: Double, n: Long): Double {
    if (n == 0L) return 1.0 // x^0 = 1 //@base
    val half = fastPow(x, n / 2) // SIRF ek call - result do baar use karo //@call
    return if (n % 2 == 0L) half * half else half * half * x //@ret
}

fun main() {
    println(myPow(2.0, 10))
    println(myPow(2.0, -2))
    println(myPow(1.0, Int.MIN_VALUE))
}

// Output:
// 1024.0
// 0.25
// 1.0
