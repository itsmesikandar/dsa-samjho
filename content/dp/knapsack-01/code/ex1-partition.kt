// Do barabar jod wale hisse? = kya koi subset ka jod total / 2 hai? (0/1 knapsack, value ki jagah true/false)
fun canPartition(nums: IntArray): Boolean {
    val total = nums.sum()
    if (total % 2 != 0) return false // odd jod - do barabar hisse ho hi nahi sakte //@odd
    val target = total / 2
    val dp = BooleanArray(target + 1) // dp[s] = ab tak ke items se jod s ban sakta hai?
    dp[0] = true // kuch na lo - jod 0
    for (x in nums) {
        for (s in target downTo x) { // ULTA - taaki ye item isi round mein dobara na jud jaaye //@loop
            if (dp[s - x]) dp[s] = true // s - x pehle ban chuka tha, ab x jodo //@mark
        }
    }
    return dp[target] //@done
}

fun main() {
    println(canPartition(intArrayOf(3, 1, 5, 9, 2)))
    println(canPartition(intArrayOf(2, 3, 4)))
    println(canPartition(intArrayOf(1, 2, 5)))
}

// Output:
// true
// false
// false
