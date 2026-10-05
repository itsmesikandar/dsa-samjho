// n! = n x (n-1) x ... x 1. Recursion mein: n! = n x (n-1)!
fun factorial(n: Int): Long {
    if (n <= 1) return 1 // base case: yahin ruko, warna calls kabhi khatam nahi hongi //@base
    val rest = factorial(n - 1) // wahi sawaal, ek chhota: (n-1)! - bharosa karo ki sahi aayega //@call
    return n * rest // apna hissa jodo aur upar wapas do //@ret
}

fun main() {
    println(factorial(5))
    println(factorial(0))
    println(factorial(20)) // Long ki limit ke paas (21! overflow karega)
}

// Output:
// 120
// 1
// 2432902008176640000
