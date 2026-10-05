// Sorted array mein target ki pehli aur aakhri position; na ho to [-1, -1]. O(log n).
fun searchRange(a: IntArray, target: Int): IntArray {
    val first = lowerBound(a, target) // pehla >= target //@first
    if (first == a.size || a[first] != target) return intArrayOf(-1, -1) // target hai hi nahi //@none
    val last = upperBound(a, target) - 1 // pehla > target - uske theek pehle wala aakhri target //@last
    return intArrayOf(first, last)
}

fun lowerBound(a: IntArray, x: Int): Int {
    var lo = 0
    var hi = a.size
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2
        if (a[mid] >= x) hi = mid else lo = mid + 1
    }
    return lo
}

fun upperBound(a: IntArray, x: Int): Int {
    var lo = 0
    var hi = a.size
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2
        if (a[mid] > x) hi = mid else lo = mid + 1
    }
    return lo
}

fun main() {
    println(searchRange(intArrayOf(5, 7, 7, 8, 8, 10), 8).contentToString())
    println(searchRange(intArrayOf(5, 7, 7, 8, 8, 10), 6).contentToString())
}

// Output:
// [3, 4]
// [-1, -1]
