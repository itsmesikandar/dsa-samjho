// LIS ka sequence bhi: har i par yaad rakho kis j se aaye (parent), phir best i se peeche chalo
fun lisSequence(nums: IntArray): List<Int> {
    val n = nums.size
    if (n == 0) return emptyList()
    val dp = IntArray(n) { 1 }
    val parent = IntArray(n) { -1 } // -1 = chain yahin se shuru
    var end = 0
    for (i in 0 until n) {
        for (j in 0 until i) {
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1
                parent[i] = j
            }
        }
        if (dp[i] > dp[end]) end = i
    }
    val seq = ArrayList<Int>()
    var k = end
    while (k != -1) {
        seq.add(nums[k])
        k = parent[k]
    }
    seq.reverse() // peeche se banaya - ulta karo
    return seq
}

fun main() {
    println(lisSequence(intArrayOf(5, 2, 8, 6, 3, 6, 9, 7)))
    println(lisSequence(intArrayOf(4, 4, 4)))
}

// Output:
// [2, 3, 6, 9]
// [4]
