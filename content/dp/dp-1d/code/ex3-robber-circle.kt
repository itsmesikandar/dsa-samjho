// Gol mohalla: pehla aur aakhri ghar neighbor. Dono ek saath nahi - to do seedhi lines: pehla hata ke, aakhri hata ke
fun robLine(nums: IntArray, lo: Int, hi: Int): Int { // lo..hi ek seedhi line (house robber)
    var prev2 = 0
    var prev1 = 0
    for (i in lo..hi) {
        val cur = maxOf(prev1, prev2 + nums[i]) //@line
        prev2 = prev1
        prev1 = cur
    }
    return prev1
}

fun rob2(nums: IntArray): Int {
    if (nums.size == 1) return nums[0] // ek hi ghar - koi neighbor nahi //@one
    return maxOf(robLine(nums, 0, nums.size - 2), robLine(nums, 1, nums.size - 1)) // aakhri chhodo / pehla chhodo //@split
}

fun main() {
    println(rob2(intArrayOf(6, 2, 3, 7)))
    println(rob2(intArrayOf(5)))
    println(rob2(intArrayOf(3, 9, 4)))
}

// Output:
// 9
// 5
// 9
