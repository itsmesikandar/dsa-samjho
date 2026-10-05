// lowerBound: pehla a[i] >= x.  upperBound: pehla a[i] > x.  Dono ka fark = x kitni baar aaya.
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
        if (a[mid] > x) hi = mid else lo = mid + 1 // sirf ye condition alag
    }
    return lo
}

fun main() {
    val a = intArrayOf(1, 2, 4, 4, 4, 7, 9)
    println(upperBound(a, 4))
    println(upperBound(a, 4) - lowerBound(a, 4)) // 4 kitni baar
    println(lowerBound(a, 3) - 1) // aakhri index jahan a[i] < 3
}

// Output:
// 5
// 3
// 1
