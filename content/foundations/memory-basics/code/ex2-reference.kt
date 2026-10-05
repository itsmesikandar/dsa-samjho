fun main() {
    val a = intArrayOf(1, 2, 3) // heap par array, a mein uska address //@a
    val b = a // copy NAHI bani! sirf address copy hua //@b
    b[0] = 99 // b ke through heap wala array badla //@write
    println(a.contentToString()) // a bhi badla dikhega //@print

    val c = a.copyOf() // ab ASLI nayi copy (naya heap block) //@copy
    c[c.size - 1] = 50 // sirf c badla //@write2
    println(a.contentToString()) // a pe koi asar nahi
    println(c.contentToString())
}

// Output:
// [99, 2, 3]
// [99, 2, 3]
// [99, 2, 50]
