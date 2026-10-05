// Kitne pairs (i < j) ka sum target ke barabar hai? Brute force: har pair check karo
fun countPairs(arr: IntArray, target: Int): Int {
    var count = 0
    for (i in arr.indices) { // bahar ka loop: n baar //@outer
        for (j in i + 1 until arr.size) { // andar ka loop: i ke baad wale sab //@inner
            if (arr[i] + arr[j] == target) count++ //@check
        }
    }
    return count //@done
}

fun main() {
    println(countPairs(intArrayOf(1, 5, 3, 3, 2), 6))
    // n = 1000 ho to kitne checks? n(n-1)/2
    println(1000L * 999 / 2)
}

// Output:
// 2
// 499500
