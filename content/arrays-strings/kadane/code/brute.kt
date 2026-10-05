// Brute force O(n^2): har start se har end tak ka sum (running sum se, O(n^3) nahi)
fun maxSubArrayBrute(nums: IntArray): Int {
    var best = Int.MIN_VALUE
    for (i in nums.indices) { // subarray kahan se shuru
        var sum = 0
        for (j in i until nums.size) { // kahan khatam
            sum += nums[j] // pichle sum mein bas ek aur item
            best = maxOf(best, sum)
        }
    }
    return best
}

fun main() {
    val nums = intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)
    println(maxSubArrayBrute(nums))
    println(nums.size * (nums.size + 1) / 2) // kitne subarrays check hue
}

// Output:
// 6
// 45
