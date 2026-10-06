import kotlin.math.abs

// Har number ke aage + ya -. P = plus walon ka jod, N = minus walon ka. P - N = target, P + N = total
// => P = (total + target) / 2. Ab sawaal: kitne subsets ka jod P? (0/1 knapsack - ginti)
fun findTargetSumWays(nums: IntArray, target: Int): Int {
    val total = nums.sum()
    if (abs(target) > total || (total + target) % 2 != 0) return 0 // P poora number hi nahi ban sakta //@check
    val p = (total + target) / 2
    val dp = IntArray(p + 1) // dp[s] = kitne subsets ka jod s
    dp[0] = 1 // khaali subset
    for (x in nums) {
        for (s in p downTo x) {
            dp[s] += dp[s - x] // x ko '+' mein daala: jo subsets s - x banate the, ab s banate //@count
        }
    }
    return dp[p] //@done
}

fun main() {
    println(findTargetSumWays(intArrayOf(2, 1, 3, 1), 3))
    println(findTargetSumWays(intArrayOf(1), 2))
}

// Output:
// 2
// 0
