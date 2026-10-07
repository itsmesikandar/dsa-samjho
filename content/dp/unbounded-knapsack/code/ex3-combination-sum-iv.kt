// Order MATTER karta hai (1+3 aur 3+1 alag). TARGET BAHAR, numbers andar - har s par 'aakhri number kaunsa' choose karo
fun combinationSum4(nums: IntArray, target: Int): Int {
    val dp = IntArray(target + 1) // dp[s] = kitni sequences ka jod s
    dp[0] = 1 // khaali sequence
    for (s in 1..target) {
        for (x in nums) {
            if (x <= s) dp[s] += dp[s - x] // aakhri number x: pehle s - x tak koi bhi sequence //@add
        }
    }
    return dp[target] //@done
}

fun main() {
    println(combinationSum4(intArrayOf(1, 3, 4), 5))
    println(combinationSum4(intArrayOf(2, 1), 3))
}

// Output:
// 6
// 3
