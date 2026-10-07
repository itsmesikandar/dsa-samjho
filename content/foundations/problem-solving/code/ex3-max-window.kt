// Continuous k numbers ka sabse bada sum. Brute force O(n*k); sliding window O(n).
fun maxWindowSum(arr: IntArray, k: Int): Int {
    var window = 0
    for (i in 0 until k) window += arr[i] // pehli window ka sum //@first
    var best = window
    for (i in k until arr.size) {
        window += arr[i] - arr[i - k] // naya aaya, sabse purana gaya //@slide
        best = maxOf(best, window) //@best
    }
    return best //@done
}

fun main() {
    println(maxWindowSum(intArrayOf(2, 1, 5, 1, 3, 2), 3))
    println(maxWindowSum(intArrayOf(-1, -2, -3), 2)) // sab negative: best = 0 se shuru mat karna
}

// Output:
// 9
// -3
