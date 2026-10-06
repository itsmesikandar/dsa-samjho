// Sabse lamba LAGAATAAR (subarray) badhta hissa. dp[i] = dp[i-1] + 1 ya 1 - bas ek variable kaafi
fun findLengthOfLCIS(nums: IntArray): Int {
    var best = 0
    var cur = 0 // i par khatam hone wala lagaataar badhta hissa
    for (i in nums.indices) {
        cur = if (i > 0 && nums[i - 1] < nums[i]) cur + 1 else 1 // badha to silsila aage, warna naya shuru //@step
        best = maxOf(best, cur)
    }
    return best //@done
}

fun main() {
    println(findLengthOfLCIS(intArrayOf(2, 6, 7, 3, 5, 8, 9, 1)))
    println(findLengthOfLCIS(intArrayOf(3, 3, 3)))
}

// Output:
// 4
// 1
