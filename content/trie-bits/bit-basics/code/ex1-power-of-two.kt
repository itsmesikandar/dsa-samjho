// 2 ki power = binary mein EXACTLY ek bit 1. n & (n - 1) sabse daayein wala 1 mita deta - kuch na bache to ek hi tha
fun isPowerOfTwo(n: Int): Boolean = n > 0 && (n and (n - 1)) == 0 // n > 0 zaroori: 0 aur negative kabhi power nahi //@check

fun main() {
    println(isPowerOfTwo(16))
    println(isPowerOfTwo(12))
    println(isPowerOfTwo(0))
    println(isPowerOfTwo(Int.MIN_VALUE)) // sirf sign bit 1 - par negative hai
}

// Output:
// true
// false
// false
// false
