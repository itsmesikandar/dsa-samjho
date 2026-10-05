// Sabse lamba substring jismein koi character repeat na ho
fun lengthOfLongestSubstring(s: String): Int {
    val inWindow = HashSet<Char>() // window ke characters
    var l = 0
    var best = 0
    for (r in s.indices) {
        while (s[r] in inWindow) { // s[r] pehle se andar: purani copy nikalne tak sikodo //@shrink
            inWindow.remove(s[l])
            l++
        }
        inWindow.add(s[r]) //@expand
        best = maxOf(best, r - l + 1) //@update
    }
    return best
}

fun main() {
    println(lengthOfLongestSubstring("abcabcbb"))
    println(lengthOfLongestSubstring("pwwkew"))
    println(lengthOfLongestSubstring(""))
}

// Output:
// 3
// 3
// 0
