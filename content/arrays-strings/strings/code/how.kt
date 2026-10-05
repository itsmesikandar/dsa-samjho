// GALAT tareeka: += har baar POORI nayi String banata hai -> 1 + 2 + ... + n copies = O(n^2)
fun buildWithPlus(n: Int): String {
    var s = ""
    for (i in 0 until n) s += ('a' + i) //@plus
    return s
}

// SAHI tareeka: StringBuilder ek hi buffer mein jodta rehta hai -> O(n)
fun buildWithBuilder(n: Int): String {
    val sb = StringBuilder()
    for (i in 0 until n) sb.append('a' + i) // buffer ke end mein, copy nahi //@append
    return sb.toString() // aakhir mein ek baar String banao //@done
}

fun main() {
    println(buildWithBuilder(5))
    println(buildWithPlus(5)) // answer same, par bade n par bahut slow
}

// Output:
// abcde
// abcde
