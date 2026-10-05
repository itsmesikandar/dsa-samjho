// "3[a2[c]]" -> "accaccacc". k[...] matlab andar wala string k baar.
fun decodeString(s: String): String {
    val counts = ArrayDeque<Int>() // har khule bracket ka k
    val outs = ArrayDeque<StringBuilder>() // bracket khulne se PEHLE tak bana hua string
    var cur = StringBuilder()
    var k = 0
    for (c in s) {
        when {
            c.isDigit() -> k = k * 10 + (c - '0') // number kai digits ka ho sakta hai (12[a]) //@digit
            c == '[' -> { // naya level: abhi tak ka kaam stack par save //@open
                counts.addLast(k)
                outs.addLast(cur)
                cur = StringBuilder()
                k = 0
            }
            c == ']' -> { // level khatam: andar wala times baar, bahar wale ke saath jodo //@close
                val times = counts.removeLast()
                val outer = outs.removeLast()
                val inner = cur.toString()
                repeat(times) { outer.append(inner) }
                cur = outer
            }
            else -> cur.append(c) //@char
        }
    }
    return cur.toString()
}

fun main() {
    println(decodeString("3[a2[c]]"))
    println(decodeString("3[a]2[bc]"))
    println(decodeString("2[abc]3[cd]ef"))
}

// Output:
// accaccacc
// aaabcbc
// abcabccdcdcdef
