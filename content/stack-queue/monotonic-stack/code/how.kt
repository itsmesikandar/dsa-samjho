// Har item ke liye: uske RIGHT pehla bada number (na ho to -1)
fun nextGreater(nums: IntArray): IntArray {
    val res = IntArray(nums.size) { -1 }
    val st = ArrayDeque<Int>() // INDEXES jinka answer abhi nahi mila; values neeche se upar ghatti hui
    for (i in nums.indices) {
        while (st.isNotEmpty() && nums[st.last()] < nums[i]) { // nums[i] in sabka pehla bada hai //@pop
            res[st.removeLast()] = nums[i]
        }
        st.addLast(i) // i ka answer abhi baaki - wait karo //@push
    }
    return res // stack mein bache: right koi bada nahi -> -1 hi raha //@done
}

fun main() {
    println(nextGreater(intArrayOf(2, 1, 2, 4, 3)).contentToString())
    println(nextGreater(intArrayOf(5, 4, 3)).contentToString())
}

// Output:
// [4, 2, 4, -1, -1]
// [-1, -1, -1]
