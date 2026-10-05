// Sabse lamba lagatar subarray jiska sum <= limit (saare numbers positive)
fun longestWithSumAtMost(nums: IntArray, limit: Int): Int {
    var l = 0
    var sum = 0
    var best = 0
    for (r in nums.indices) {
        sum += nums[r] // 1. r ko andar lo
        while (sum > limit) { // 2. invalid? jab tak valid na ho, l ko nikaalo
            sum -= nums[l]
            l++
        }
        best = maxOf(best, r - l + 1) // 3. window ab valid hai: answer update
    }
    return best
}

fun main() {
    println(longestWithSumAtMost(intArrayOf(3, 1, 2, 1, 4, 1, 1), 5))
    println(longestWithSumAtMost(intArrayOf(9, 9), 5)) // har item akela bhi bada: 0
}

// Output:
// 3
// 0
