// String ko pieces mein kaato ki HAR piece palindrome ho. Saare tareeke do.
fun partition(s: String): List<List<String>> {
    val res = mutableListOf<List<String>>()
    val path = mutableListOf<String>()
    fun isPal(l: Int, r: Int): Boolean {
        var a = l
        var b = r
        while (a < b) {
            if (s[a] != s[b]) return false
            a++
            b--
        }
        return true
    }
    fun bt(start: Int) {
        if (start == s.length) { // poora string kat gaya: ek tareeka mila //@found
            res.add(path.toList())
            return
        }
        for (end in start until s.length) { // agla piece s[start..end] - har length try
            if (!isPal(start, end)) continue // palindrome nahi: is raaste jaana hi bekaar //@prune
            path.add(s.substring(start, end + 1)) //@choose
            bt(end + 1) // baaki string ko kaato
            path.removeAt(path.size - 1) //@unchoose
        }
    }
    bt(0)
    return res
}

fun main() {
    println(partition("aab"))
    println(partition("a"))
}

// Output:
// [[a, a, b], [aa, b]]
// [[a]]
