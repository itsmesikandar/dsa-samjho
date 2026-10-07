// Anagram = same letters, same count, bas order alag
fun isAnagram(s: String, t: String): Boolean {
    if (s.length != t.length) return false
    val count = IntArray(26) //@init
    for (i in s.indices) {
        count[s[i] - 'a']++ // s ka letter: +1 //@plus
        count[t[i] - 'a']-- // t ka letter: -1 //@minus
    }
    for (c in count) {
        if (c != 0) return false // kisi letter ka hisaab barabar nahi //@check
    }
    return true //@done
}

fun main() {
    println(isAnagram("listen", "silent"))
    println(isAnagram("rat", "car"))
}

// Output:
// true
// false
