// Negative numbers: two's complement. -x = ~x + 1. Sabse left (31st) bit = sign
fun main() {
    val x = 5
    println(Integer.toBinaryString(x)) // 101
    println(Integer.toBinaryString(-x)) // 32 bits: aage sab 1
    println((-x).toString(2)) // Kotlin toString(2) sign alag likhta - bits nahi dikhata
    println(x.inv() + 1) // ~x + 1 = -x
    println("${-16 shr 2} ${-16 ushr 28}") // shr sign bit copy karta, ushr left se 0 bharta
    val big = Int.MAX_VALUE
    println(big + 1) // overflow: wrap hoke sabse chhota int
}

// Output:
// 101
// 11111111111111111111111111111011
// -101
// -5
// -4 15
// -2147483648
