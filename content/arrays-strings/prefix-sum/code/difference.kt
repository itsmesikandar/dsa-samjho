// Difference array: "range mein v jodo" wale bahut saare updates, har ek O(1)
fun applyUpdates(n: Int, updates: List<IntArray>): IntArray {
    val diff = IntArray(n + 1)
    for ((l, r, v) in updates) {
        diff[l] += v // yahan se v shuru
        diff[r + 1] -= v // r ke baad v khatam
    }
    // prefix sum lagao -> asli values
    val arr = IntArray(n)
    var running = 0
    for (i in 0 until n) {
        running += diff[i]
        arr[i] = running
    }
    return arr
}

fun main() {
    // [1..3] mein +5, [2..5] mein +2
    val updates = listOf(intArrayOf(1, 3, 5), intArrayOf(2, 5, 2))
    println(applyUpdates(6, updates).contentToString())
}

// Output:
// [0, 5, 7, 7, 2, 2]
