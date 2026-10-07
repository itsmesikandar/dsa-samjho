// Bitwise operators: har bit par alag se kaam - result ka bit k sirf a ke bit k aur b ke bit k se
fun main() {
    val a = 12 // 1100
    val b = 10 // 1010
    println(a and b) // AND: dono 1 tabhi 1 -> 1000 = 8 //@and
    println(a or b) // OR: koi ek 1 to 1 -> 1110 = 14 //@or
    println(a xor b) // XOR: alag ho to 1 -> 0110 = 6 //@xor
    println(a.inv()) // NOT: saare 32 bits ulte -> -13 (two's complement) //@not
    println(a shl 1) // left shift: har bit ek step left = x2 -> 24 //@shl
    println(a shr 1) // right shift: ek step right = /2 -> 6 //@shr
}

// Output:
// 8
// 14
// 6
// -13
// 24
// 6
