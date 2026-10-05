// Circular array: last ke baad wapas pehla. Max subarray sum?
fun maxCircular(nums: IntArray): Int {
    var curMax = 0
    var best = nums[0] // normal Kadane ka answer (bina wrap)
    var curMin = 0
    var worst = nums[0] // sabse CHHOTA subarray sum (ulta Kadane)
    var total = 0
    for (x in nums) {
        curMax = maxOf(curMax + x, x) //@max
        best = maxOf(best, curMax)
        curMin = minOf(curMin + x, x) // wahi Kadane, bas min ke liye //@min
        worst = minOf(worst, curMin)
        total += x
    }
    // wrap wala answer = total - (beech ka sabse bura hissa)
    // sab negative hon to total - worst = 0 (khaali subarray) - galat, isliye best hi lo
    return if (best < 0) best else maxOf(best, total - worst) //@done
}

fun main() {
    println(maxCircular(intArrayOf(5, -3, 5))) // wrap: 5 + 5
    println(maxCircular(intArrayOf(-3, -2, -3))) // sab negative
    println(maxCircular(intArrayOf(1, -2, 3, -2))) // wrap se fayda nahi
}

// Output:
// 10
// -2
// 3
