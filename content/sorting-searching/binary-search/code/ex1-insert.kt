// Target ka index do; na ho to wo index jahan daalne par array sorted rahe
fun searchInsert(a: IntArray, target: Int): Int {
    var lo = 0
    var hi = a.size - 1
    while (lo <= hi) {
        val mid = lo + (hi - lo) / 2 //@mid
        when {
            a[mid] == target -> return mid //@found
            a[mid] < target -> lo = mid + 1 //@right
            else -> hi = mid - 1 //@left
        }
    }
    return lo // loop khatam: lo = pehla index jahan a[lo] > target (ya end) //@insert
}

fun main() {
    val a = intArrayOf(1, 3, 5, 6)
    println(searchInsert(a, 2))
    println(searchInsert(a, 5))
    println(searchInsert(a, 7))
}

// Output:
// 1
// 2
// 4
