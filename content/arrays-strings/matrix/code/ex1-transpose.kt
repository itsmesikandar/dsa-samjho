// Transpose: rows columns ban jaati hain. g[r][c] -> t[c][r]
fun transpose(g: Array<IntArray>): Array<IntArray> {
    val rows = g.size
    val cols = g[0].size
    val t = Array(cols) { IntArray(rows) } // naya grid: cols x rows //@alloc
    for (r in 0 until rows) {
        for (c in 0 until cols) {
            t[c][r] = g[r][c] // row/column ki jagah badal di //@copy
        }
    }
    return t //@done
}

fun main() {
    val g = arrayOf(intArrayOf(1, 2, 3), intArrayOf(4, 5, 6))
    println(transpose(g).contentDeepToString())
}

// Output:
// [[1, 4], [2, 5], [3, 6]]
