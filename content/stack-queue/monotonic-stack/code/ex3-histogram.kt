// Histogram ke bars (har ek ki width 1). Inke andar sabse bada rectangle - area?
fun largestRectangleArea(h: IntArray): Int {
    val st = ArrayDeque<Int>() // indexes, heights neeche se upar BADHTE hue
    var best = 0
    for (i in 0..h.size) {
        val cur = if (i == h.size) 0 else h[i] // aakhir mein nakli 0 height: bache sab bars pop ho jaayein
        while (st.isNotEmpty() && h[st.last()] >= cur) { // top bar ki height wala rectangle ab daayein nahi badh sakta //@pop
            val height = h[st.removeLast()]
            val left = if (st.isEmpty()) -1 else st.last() // isse chhota pichhla bar = left deewar
            best = maxOf(best, height * (i - left - 1)) // width = left aur i ke beech ke bars //@area
        }
        st.addLast(i) //@push
    }
    return best
}

fun main() {
    println(largestRectangleArea(intArrayOf(2, 1, 5, 6, 2, 3)))
    println(largestRectangleArea(intArrayOf(2, 4)))
}

// Output:
// 10
// 4
