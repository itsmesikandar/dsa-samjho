// s mein p ke saare anagrams kahan-kahan shuru hote hain (start indexes)
fun findAnagrams(s: String, p: String): List<Int> {
    val res = mutableListOf<Int>()
    val k = p.length
    if (k > s.length) return res
    val need = IntArray(26) // p ke har letter ki ginti
    val have = IntArray(26) // window ke har letter ki ginti
    for (c in p) need[c - 'a']++ //@init
    for (r in s.indices) {
        have[s[r] - 'a']++ // naya char window mein //@add
        if (r >= k) have[s[r - k] - 'a']-- // window k se badi: sabse purana bahar //@remove
        if (r >= k - 1 && have.contentEquals(need)) res.add(r - k + 1) // 26 counts same = anagram //@check
    }
    return res
}

fun main() {
    println(findAnagrams("cbaebabacd", "abc"))
    println(findAnagrams("abab", "ab"))
}

// Output:
// [0, 6]
// [0, 1, 2]
