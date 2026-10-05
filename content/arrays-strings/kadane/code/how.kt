// Kadane: sabse bada subarray sum, ek hi pass mein
fun maxSubArray(nums: IntArray): Int {
    var cur = nums[0] // "is index par khatam hone wala" best sum //@init
    var best = nums[0] // ab tak ka sabse bada
    for (i in 1 until nums.size) {
        cur = maxOf(nums[i], cur + nums[i]) // purana sum saath lo, ya yahin se naya shuru? //@choose
        best = maxOf(best, cur) // record toota? //@best
    }
    return best //@done
}

fun main() {
    println(maxSubArray(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)))
    println(maxSubArray(intArrayOf(-3, -1, -2))) // sab negative: sabse chhota nuksaan
}

// Output:
// 6
// -1
