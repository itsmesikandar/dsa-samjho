// Pivot index: jiske left ka sum == right ka sum. Sabse pehla do, na mile to -1.
fun pivotIndex(arr: IntArray): Int {
    val total = arr.sum() // poore array ka total //@total
    var left = 0 // i ke left wale items ka sum
    for (i in arr.indices) {
        val right = total - left - arr[i] // baaki bacha = right ka sum //@check
        if (left == right) return i //@found
        left += arr[i] // agle i ke liye left badhao //@add
    }
    return -1 //@none
}

fun main() {
    println(pivotIndex(intArrayOf(1, 7, 3, 6, 5, 6)))
    println(pivotIndex(intArrayOf(1, 2, 3)))
    println(pivotIndex(intArrayOf(2, 1, -1))) // index 0: left khaali (0), right 1 + (-1) = 0
}

// Output:
// 3
// -1
// 0
