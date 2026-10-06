// Recursion + yaaddasht (memo): har fib(k) sirf EK baar nikaalo, dobara poocha to memo se
fun fib(n: Int, memo: LongArray): Long {
    if (n <= 1) return n.toLong() // base case: fib(0) = 0, fib(1) = 1 //@base
    if (memo[n] != 0L) return memo[n] // pehle nikaala hua - seedha lautao //@hit
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo) // pehli baar - nikaalo aur likh lo //@save
    return memo[n]
}

fun main() {
    println(fib(6, LongArray(7)))
    println(fib(50, LongArray(51))) // bina memo ke ~4 x 10^10 calls; memo se 99
}

// Output:
// 8
// 12586269025
