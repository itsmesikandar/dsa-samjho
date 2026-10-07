// n Ints ke liye kitni memory (bytes)? Long return karo, taaki bade n par overflow na ho
fun bytesForInts(n: Int): Long {
    return n.toLong() * Int.SIZE_BYTES // har Int = 4 bytes //@calc
}

fun main() {
    println(bytesForInts(3)) // 3 x 4 = 12
    println(bytesForInts(100_000)) // 1 lakh Ints = 400000 bytes (~390 KB)
    println(Long.SIZE_BYTES) // Long = 8 bytes, matlab LongArray double memory
}

// Output:
// 12
// 400000
// 8
