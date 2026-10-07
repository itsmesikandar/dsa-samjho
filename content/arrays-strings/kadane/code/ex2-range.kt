// Max subarray sum ke saath uska start aur end index bhi: [sum, start, end]
fun maxSubArrayRange(nums: IntArray): IntArray {
    var cur = nums[0] //@init
    var curStart = 0 // abhi wale subarray ki shuruaat
    var best = nums[0]
    var bestL = 0
    var bestR = 0
    for (i in 1 until nums.size) {
        if (cur < 0) { // purana sum load hai (negative) -> chhodo, yahin se naya shuru //@restart
            cur = nums[i]
            curStart = i
        } else { // purana sum faydemand -> jodte raho //@extend
            cur += nums[i]
        }
        if (cur > best) { // naya record: range bhi yaad rakho //@best
            best = cur
            bestL = curStart
            bestR = i
        }
    }
    return intArrayOf(best, bestL, bestR) //@done
}

fun main() {
    println(maxSubArrayRange(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4)).contentToString())
    println(maxSubArrayRange(intArrayOf(5, -9, 6)).contentToString())
}

// Output:
// [6, 3, 6]
// [6, 2, 2]
