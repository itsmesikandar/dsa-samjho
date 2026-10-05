// Har row sorted, aur har row ka pehla number pichhli row ke aakhri se bada. Target hai?
fun searchMatrix(m: Array<IntArray>, target: Int): Boolean {
    val cols = m[0].size
    var lo = 0
    var hi = m.size * cols - 1 // poori matrix ko ek lambi sorted line maano
    while (lo <= hi) {
        val mid = lo + (hi - lo) / 2
        val v = m[mid / cols][mid % cols] // line ka index -> (row, col) //@map
        when {
            v == target -> return true //@found
            v < target -> lo = mid + 1 //@right
            else -> hi = mid - 1 //@left
        }
    }
    return false //@none
}

fun main() {
    val m = arrayOf(intArrayOf(1, 3, 5, 7), intArrayOf(10, 11, 16, 20), intArrayOf(23, 30, 34, 60))
    println(searchMatrix(m, 16))
    println(searchMatrix(m, 13))
}

// Output:
// true
// false
