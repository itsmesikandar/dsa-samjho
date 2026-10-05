// Sabse chhota lagatar subarray jiska sum >= target (saare numbers positive). Na mile to 0.
fun minSubArrayLen(target: Int, nums: IntArray): Int {
    var l = 0
    var sum = 0
    var best = Int.MAX_VALUE // abhi tak koi valid window nahi //@init
    for (r in nums.indices) {
        sum += nums[r] // window daayein failao //@expand
        while (sum >= target) { // valid hai: ab chhota karke dekho //@check
            best = minOf(best, r - l + 1) //@update
            sum -= nums[l] // baayein se sikodo //@shrink
            l++
        }
    }
    return if (best == Int.MAX_VALUE) 0 else best //@done
}

fun main() {
    println(minSubArrayLen(7, intArrayOf(2, 3, 1, 2, 4, 3)))
    println(minSubArrayLen(100, intArrayOf(1, 2, 3))) // poora array bhi kam pada
}

// Output:
// 2
// 0
