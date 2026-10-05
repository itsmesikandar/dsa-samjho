// Saare 0 end mein, baaki numbers ka order wahi rahe (in-place)
fun moveZeroes(nums: IntArray) {
    var w = 0 // agla non-zero kahan aayega //@init
    for (r in nums.indices) {
        if (nums[r] != 0) { // non-zero mila? //@check
            val t = nums[w] // swap: non-zero aage, wahan wala 0 peeche //@swap
            nums[w] = nums[r]
            nums[r] = t
            w++
        }
    }
}

fun main() {
    val a = intArrayOf(0, 1, 0, 3, 12)
    moveZeroes(a)
    println(a.contentToString())
    val b = intArrayOf(0)
    moveZeroes(b)
    println(b.contentToString())
}

// Output:
// [1, 3, 12, 0, 0]
// [0]
