// Har item ke liye: uske LEFT pehla chhota number (na ho to -1)
fun previousSmaller(nums: IntArray): IntArray {
    val res = IntArray(nums.size)
    val st = ArrayDeque<Int>() // values, neeche se upar BADHTE hue
    for ((i, x) in nums.withIndex()) {
        // x se bade/barabar hatao: x ke baad aane walon ke liye x hi better (paas + chhota) 'chhota' hai
        while (st.isNotEmpty() && st.last() >= x) st.removeLast()
        res[i] = st.lastOrNull() ?: -1 // jo bacha top par wahi left pehla chhota
        st.addLast(x)
    }
    return res
}

fun main() {
    println(previousSmaller(intArrayOf(4, 5, 2, 10, 8)).contentToString())
}

// Output:
// [-1, 4, -1, 2, 2]
