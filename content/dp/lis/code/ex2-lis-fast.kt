// LIS O(n log n): tails[k] = (k + 1) length wali badhti chain ka SABSE CHHOTA aakhri element. tails hamesha sorted
fun lengthOfLISFast(nums: IntArray): Int {
    val tails = IntArray(nums.size)
    var size = 0
    for (x in nums) {
        var lo = 0
        var hi = size // pehla tails[idx] >= x dhoondo (lower bound)
        while (lo < hi) {
            val mid = (lo + hi) / 2
            if (tails[mid] < x) lo = mid + 1 else hi = mid
        }
        tails[lo] = x // bada aakhri element hata ke chhota rakho - aage badhne ka zyada mauka //@place
        if (lo == size) size++ // x sab se bada tha - chain ek lambi //@grow
    }
    return size //@done
}

fun main() {
    println(lengthOfLISFast(intArrayOf(5, 2, 8, 6, 3, 6, 9, 7)))
    println(lengthOfLISFast(intArrayOf(3, 4, 1)))
}

// Output:
// 4
// 2
