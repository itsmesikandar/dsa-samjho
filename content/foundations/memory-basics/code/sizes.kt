fun main() {
    // Har primitive type kitne bytes ka hota hai
    println("Byte: ${Byte.SIZE_BYTES}, Short: ${Short.SIZE_BYTES}, Int: ${Int.SIZE_BYTES}, Long: ${Long.SIZE_BYTES}")
    println("Char: ${Char.SIZE_BYTES}, Float: ${Float.SIZE_BYTES}, Double: ${Double.SIZE_BYTES}")

    // Int = 4 bytes = 32 bits, isliye iski ek limit hai
    println(Int.MAX_VALUE)

    // Limit cross karte hi number ghoom ke negative ho jaata hai (overflow) - koi error nahi!
    val big = Int.MAX_VALUE
    println(big + 1)

    // Bada answer chahiye to Long (8 bytes) use karo
    println(big.toLong() + 1)
}

// Output:
// Byte: 1, Short: 2, Int: 4, Long: 8
// Char: 2, Float: 4, Double: 8
// 2147483647
// -2147483648
// 2147483648
