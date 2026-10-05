// Size k ki window ka sabse bada average
fun findMaxAverage(nums: IntArray, k: Int): Double {
    var sum = 0L // Long: bade inputs par overflow se bachne ke liye
    for (i in 0 until k) sum += nums[i]
    var best = sum
    for (r in k until nums.size) {
        sum += nums[r] - nums[r - k]
        best = maxOf(best, sum)
    }
    return best.toDouble() / k // divide sirf end mein, ek baar (sum bada = average bada)
}

fun main() {
    println(findMaxAverage(intArrayOf(1, 12, -5, -6, 50, 3), 4))
    println(findMaxAverage(intArrayOf(5), 1))
}

// Output:
// 12.75
// 5.0
