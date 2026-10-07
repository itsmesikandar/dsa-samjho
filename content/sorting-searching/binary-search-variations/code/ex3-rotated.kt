// Sorted (distinct) array ko kisi point par rotate kar diya. Target ka index; na ho to -1. O(log n).
fun search(a: IntArray, target: Int): Int {
    var lo = 0
    var hi = a.size - 1
    while (lo <= hi) {
        val mid = lo + (hi - lo) / 2
        if (a[mid] == target) return mid //@found
        if (a[lo] <= a[mid]) { // left half [lo..mid] pakka sorted hai //@leftSorted
            if (target >= a[lo] && target < a[mid]) hi = mid - 1 // target usi sorted hisse mein
            else lo = mid + 1
        } else { // warna right half [mid..hi] sorted hai //@rightSorted
            if (target > a[mid] && target <= a[hi]) lo = mid + 1
            else hi = mid - 1
        }
    }
    return -1 //@none
}

fun main() {
    println(search(intArrayOf(4, 5, 6, 7, 0, 1, 2), 0))
    println(search(intArrayOf(4, 5, 6, 7, 0, 1, 2), 3))
}

// Output:
// 4
// -1
