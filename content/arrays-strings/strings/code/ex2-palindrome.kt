// Sirf letters/digits dekho, case ignore karo. Dono kinaron se milao.
fun isPalindrome(s: String): Boolean {
    var l = 0 //@init
    var r = s.length - 1
    while (l < r) {
        while (l < r && !s[l].isLetterOrDigit()) l++ // faltu char (space, comma) skip //@skipL
        while (l < r && !s[r].isLetterOrDigit()) r-- //@skipR
        if (s[l].lowercaseChar() != s[r].lowercaseChar()) return false // mismatch //@cmp
        l++ // match - dono andar //@move
        r--
    }
    return true //@done
}

fun main() {
    println(isPalindrome("A man, a plan, a canal: Panama"))
    println(isPalindrome("race a car"))
}

// Output:
// true
// false
