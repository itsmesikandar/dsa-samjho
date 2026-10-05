fun isVowel(c: Char) = c in "aeiou"

// Length k ke kisi bhi substring mein zyada se zyada kitne vowels?
fun maxVowels(s: String, k: Int): Int {
    var count = 0
    for (i in 0 until k) if (isVowel(s[i])) count++ // pehli window ke vowels //@first
    var best = count
    for (r in k until s.length) {
        if (isVowel(s[r])) count++ // naya char window mein aaya //@add
        if (isVowel(s[r - k])) count-- // sabse purana char window se gaya //@remove
        best = maxOf(best, count) //@best
    }
    return best
}

fun main() {
    println(maxVowels("abciiidef", 3))
    println(maxVowels("leetcode", 3))
}

// Output:
// 3
// 2
