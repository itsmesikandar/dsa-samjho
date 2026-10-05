// Har digit ka square jodo
fun digitSquareSum(n: Int): Int {
    var s = 0
    var x = n
    while (x > 0) {
        val d = x % 10
        s += d * d
        x /= 10
    }
    return s
}

// Baar-baar digitSquareSum karo: 1 aa gaya = happy. Koi number DOBARA aaya = chakkar, kabhi 1 nahi aayega.
fun isHappy(n: Int): Boolean {
    val seen = HashSet<Int>()
    var x = n
    while (x != 1) {
        if (!seen.add(x)) return false // ye number pehle aa chuka -> loop mein phas gaye //@cycle
        x = digitSquareSum(x) //@next
    }
    return true //@happy
}

fun main() {
    println(isHappy(19)) // 19 -> 82 -> 68 -> 100 -> 1
    println(isHappy(2))
}

// Output:
// true
// false
