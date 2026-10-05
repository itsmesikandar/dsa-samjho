// nums1 ke har number ke liye: nums2 mein usi number ke DAAYEIN pehla bada (na ho to -1). nums1 subset of nums2, sab distinct.
fun nextGreaterElement(nums1: IntArray, nums2: IntArray): IntArray {
    val next = HashMap<Int, Int>() // value -> uska next greater (nums2 mein)
    val st = ArrayDeque<Int>() // values jinka next greater abhi nahi mila
    for (x in nums2) {
        while (st.isNotEmpty() && st.last() < x) next[st.removeLast()] = x //@pop
        st.addLast(x) //@push
    }
    return IntArray(nums1.size) { next[nums1[it]] ?: -1 } // map mein nahi = koi bada nahi //@lookup
}

fun main() {
    println(nextGreaterElement(intArrayOf(4, 1, 2), intArrayOf(1, 3, 4, 2)).contentToString())
    println(nextGreaterElement(intArrayOf(2, 4), intArrayOf(1, 2, 3, 4)).contentToString())
}

// Output:
// [-1, 3, -1]
// [3, -1]
