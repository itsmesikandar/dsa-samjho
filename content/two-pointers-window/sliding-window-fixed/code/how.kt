// Size k ki har window (continuous k items) mein sabse bada sum
fun maxSumK(nums: IntArray, k: Int): Int {
    var sum = 0
    for (i in 0 until k) sum += nums[i] // pehli window ka sum, ek baar poora jodo //@first
    var best = sum
    for (r in k until nums.size) { // window ek step aage shift hui
        sum += nums[r] - nums[r - k] // naya item andar, sabse purana bahar //@slide
        best = maxOf(best, sum) //@best
    }
    return best
}

fun main() {
    println(maxSumK(intArrayOf(2, 1, 5, 1, 3, 2), 3))
    println(maxSumK(intArrayOf(-1, -2, -3), 2)) // sab negative: best bhi negative
}

// Output:
// 9
// -3
