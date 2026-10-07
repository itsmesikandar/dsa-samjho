// Kitne 1 bits? x & (x - 1) har baar sabse right wala 1 hatata - loop sirf utni baar jitne 1 bits
fun hammingWeight(n: Int): Int {
    var x = n
    var count = 0
    while (x != 0) {
        x = x and (x - 1) // sabse right wala 1 gaya //@drop
        count++
    }
    return count //@done
}

fun main() {
    println(hammingWeight(26)) // 11010
    println(hammingWeight(-1)) // saare 32 bits 1 (negative bhi chalta - loop 0 tak pahunchta hai)
    println(Integer.bitCount(26)) // library wala tareeka
}

// Output:
// 3
// 32
// 3
