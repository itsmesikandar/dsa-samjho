// Sabse lamba substring jismein HAR character kam se kam k baar aaye
fun longestSubstring(s: String, k: Int): Int = solve(s, 0, s.length, k)

// s[lo, hi) ka jawab
fun solve(s: String, lo: Int, hi: Int, k: Int): Int {
    if (hi - lo < k) return 0 // itne chhote hisse mein koi char k baar aa hi nahi sakta //@base
    val cnt = IntArray(26)
    for (i in lo until hi) cnt[s[i] - 'a']++ //@count
    var best = 0
    var start = lo
    for (i in lo until hi) {
        if (cnt[s[i] - 'a'] < k) { // ye char kisi answer mein nahi aa sakta: yahin todo //@split
            best = maxOf(best, solve(s, start, i, k)) // pichla tukda alag se hal karo
            start = i + 1
        }
    }
    if (start == lo) return hi - lo // koi kharab char nahi mila: poora hissa valid //@whole
    return maxOf(best, solve(s, start, hi, k)) // aakhri tukda //@ret
}

fun main() {
    println(longestSubstring("ababbc", 2))
    println(longestSubstring("aaabb", 3))
    println(longestSubstring("abcde", 2))
}

// Output:
// 5
// 3
// 0
