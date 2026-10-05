fun main() {
    val st = ArrayDeque<Int>() // Kotlin mein stack = ArrayDeque; top = last
    st.addLast(10) // push
    st.addLast(20)
    st.addLast(30)
    println(st.last()) // peek: upar wala dekho, nikaalo mat
    println(st.removeLast()) // pop: upar wala nikaalo
    println(st.size)
    println(st.lastOrNull() ?: "khaali") // khaali stack par last() exception deta - lastOrNull safe
}

// Output:
// 30
// 30
// 2
// 20
