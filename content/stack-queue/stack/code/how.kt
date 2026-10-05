// Brackets sahi khule-band hain? "([]{})" sahi, "(]" galat, "([)]" galat
fun isValid(s: String): Boolean {
    val st = ArrayDeque<Char>() // khule brackets jo abhi band nahi hue (top = last)
    val pair = mapOf(')' to '(', ']' to '[', '}' to '{')
    for (c in s) {
        if (c !in pair) { // khulne wala: stack par rakho //@push
            st.addLast(c)
        } else if (st.isEmpty() || st.removeLast() != pair[c]) { // band wala SABSE TAAZA khule se match hona chahiye //@match
            return false
        }
    }
    return st.isEmpty() // koi khula reh gaya to galat //@end
}

fun main() {
    println(isValid("([]{})"))
    println(isValid("([)]"))
    println(isValid("(("))
}

// Output:
// true
// false
// false
