// Har i ke liye baaki sab ka product - bina division ke, O(n)
fun productExceptSelf(nums: IntArray): IntArray {
    val n = nums.size
    val res = IntArray(n)
    res[0] = 1 // index 0 ke left mein kuch nahi
    for (i in 1 until n) {
        res[i] = res[i - 1] * nums[i - 1] // res[i] = i ke LEFT wale sab ka product //@left
    }
    var right = 1 // i ke RIGHT wale sab ka product (peeche se chalte hue)
    for (i in n - 1 downTo 0) {
        res[i] *= right // left x right = sab, sirf nums[i] chhod ke //@right
        right *= nums[i]
    }
    return res //@done
}

fun main() {
    println(productExceptSelf(intArrayOf(1, 2, 3, 4)).contentToString())
    println(productExceptSelf(intArrayOf(-1, 1, 0, -3, 3)).contentToString()) // 0 wala case
}

// Output:
// [24, 12, 8, 6]
// [0, 0, 9, 0, 0]
