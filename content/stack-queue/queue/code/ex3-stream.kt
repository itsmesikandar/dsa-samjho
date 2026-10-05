// Stream mein har naya char aane ke baad: ab tak ka PEHLA char jo sirf ek baar aaya hai? Na ho to '#'
fun firstNonRepeating(stream: String): String {
    val count = IntArray(26)
    val q = ArrayDeque<Char>() // candidates, aane ke order mein
    val out = StringBuilder()
    for (c in stream) {
        count[c - 'a']++ //@count
        q.addLast(c)
        while (q.isNotEmpty() && count[q.first() - 'a'] > 1) q.removeFirst() // aage wala repeat ho chuka: ab kabhi kaam ka nahi //@drop
        out.append(q.firstOrNull() ?: '#') //@answer
    }
    return out.toString()
}

fun main() {
    println(firstNonRepeating("aabc"))
    println(firstNonRepeating("zz"))
}

// Output:
// a#bb
// z#
