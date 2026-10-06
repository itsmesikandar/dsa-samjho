// Patthar do dheron mein - bacha hua = |dher1 - dher2|. Ek dher total/2 ke jitna paas ho utna kam
fun lastStoneWeightII(stones: IntArray): Int {
    val total = stones.sum()
    val half = total / 2
    val dp = BooleanArray(half + 1) // dp[s] = koi dher jiska jod s
    dp[0] = true
    for (x in stones) {
        for (s in half downTo x) {
            if (dp[s - x]) dp[s] = true //@mark
        }
    }
    for (s in half downTo 0) {
        if (dp[s]) return total - 2 * s // ek dher s, doosra total - s; farak total - 2s //@best
    }
    return total
}

fun main() {
    println(lastStoneWeightII(intArrayOf(6, 3, 8, 2)))
    println(lastStoneWeightII(intArrayOf(5)))
}

// Output:
// 1
// 5
