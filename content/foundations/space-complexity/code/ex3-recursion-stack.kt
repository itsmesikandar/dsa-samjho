// Recursive sum: koi array nahi banayi, phir bhi O(n) space! (call stack)
fun sumRec(arr: IntArray, i: Int): Int {
    if (i == arr.size) return 0 // base case: aage kuch nahi //@base
    return arr[i] + sumRec(arr, i + 1) // pehle baaki ka sum, phir jodo //@call
}

// Loop wala version: O(1) space
fun sumLoop(arr: IntArray): Int {
    var total = 0
    for (x in arr) total += x
    return total
}

fun main() {
    val arr = intArrayOf(3, 1, 4, 2)
    println(sumRec(arr, 0))
    println(sumLoop(arr))
}

// Output:
// 10
// 10
