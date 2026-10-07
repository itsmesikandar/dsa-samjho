// Har din: kitne din baad zyada garmi padegi? (kabhi na pade to 0)
fun dailyTemperatures(t: IntArray): IntArray {
    val res = IntArray(t.size)
    val st = ArrayDeque<Int>() // din (index) jinka 'garam din' abhi nahi aaya; temps neeche se upar ghatte
    for (i in t.indices) {
        while (st.isNotEmpty() && t[st.last()] < t[i]) { // aaj in sabse garam hai //@pop
            val d = st.removeLast()
            res[d] = i - d // value nahi, DISTANCE chahiye - isliye index rakhe
        }
        st.addLast(i) //@push
    }
    return res
}

fun main() {
    println(dailyTemperatures(intArrayOf(73, 74, 75, 71, 69, 72, 76, 73)).contentToString())
    println(dailyTemperatures(intArrayOf(30, 40, 50, 60)).contentToString())
}

// Output:
// [1, 1, 4, 2, 1, 1, 0, 0]
// [1, 1, 1, 0]
