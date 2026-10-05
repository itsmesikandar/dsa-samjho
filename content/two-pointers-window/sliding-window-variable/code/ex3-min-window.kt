// s ka sabse chhota substring jismein t ke saare characters (ginti ke saath) hon
fun minWindow(s: String, t: String): String {
    val need = IntArray(128) // har char ki kitni zaroorat baaki (negative = window mein extra)
    for (c in t) need[c.code]++
    var missing = t.length // abhi kitne chars kam hain (ginti ke saath) //@init
    var l = 0
    var bestL = 0
    var bestLen = Int.MAX_VALUE
    for (r in s.indices) {
        if (need[s[r].code] > 0) missing-- // ye char kaam ka tha //@expand
        need[s[r].code]-- // window ne le liya
        while (missing == 0) { // saare mil gaye: window valid //@check
            if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l } //@update
            need[s[l].code]++ // s[l] wapas do //@shrink
            if (need[s[l].code] > 0) missing++ // zaroori char nikal gaya: window ab invalid
            l++
        }
    }
    return if (bestLen == Int.MAX_VALUE) "" else s.substring(bestL, bestL + bestLen)
}

fun main() {
    println(minWindow("ADOBECODEBANC", "ABC"))
    println(minWindow("aa", "aa"))
    println(minWindow("a", "aa").isEmpty()) // t ke liye s mein 'a' kam hain
}

// Output:
// BANC
// aa
// true
