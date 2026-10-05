// Helper pattern: bahar wala function simple rehta hai,
// asli kaam helper karta hai extra parameters (l, r) ke saath - koi substring copy nahi
fun isPalindrome(s: String): Boolean = isPal(s, 0, s.length - 1)

fun isPal(s: String, l: Int, r: Int): Boolean {
    if (l >= r) return true // 0 ya 1 char: palindrome hi hai
    if (s[l] != s[r]) return false // kinare alag: wahin khatam
    return isPal(s, l + 1, r - 1) // andar wala hissa
}

fun main() {
    println(isPalindrome("racecar"))
    println(isPalindrome("abca"))
    println(isPalindrome(""))
}

// Output:
// true
// false
// true
