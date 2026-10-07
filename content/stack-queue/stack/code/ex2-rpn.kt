// Reverse Polish Notation: operator apne 2 numbers ke BAAD aata hai. "2 1 + 3 *" = (2 + 1) * 3
fun evalRPN(tokens: Array<String>): Int {
    val st = ArrayDeque<Int>()
    for (t in tokens) {
        when (t) {
            "+", "-", "*", "/" -> {
                val b = st.removeLast() // pehle nikla = DOOSRA operand (order dhyaan se) //@op
                val a = st.removeLast()
                st.addLast(
                    when (t) {
                        "+" -> a + b
                        "-" -> a - b
                        "*" -> a * b
                        else -> a / b // zero ki taraf truncate (Kotlin/Java default)
                    },
                )
            }
            else -> st.addLast(t.toInt()) // number: stack par //@num
        }
    }
    return st.last() //@result
}

fun main() {
    println(evalRPN(arrayOf("2", "1", "+", "3", "*")))
    println(evalRPN(arrayOf("4", "13", "5", "/", "+")))
    println(evalRPN(arrayOf("10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+")))
}

// Output:
// 9
// 6
// 22
