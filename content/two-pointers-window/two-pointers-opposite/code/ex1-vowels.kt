// Sirf vowels ko ulta karo, baaki letters apni jagah
fun reverseVowels(s: String): String {
    val c = s.toCharArray()
    val vowels = "aeiouAEIOU"
    var l = 0 //@init
    var r = c.size - 1
    while (l < r) {
        while (l < r && c[l] !in vowels) l++ // left se agla vowel dhoondho //@skipL
        while (l < r && c[r] !in vowels) r-- // right se agla vowel //@skipR
        val t = c[l] // dono vowels swap //@swap
        c[l] = c[r]
        c[r] = t
        l++
        r--
    }
    return String(c) //@done
}

fun main() {
    println(reverseVowels("hello"))
    println(reverseVowels("chai pakoda"))
}

// Output:
// holle
// chao pakida
