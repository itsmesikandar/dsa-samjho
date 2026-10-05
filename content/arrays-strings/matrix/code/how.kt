// Har row ka sum aur har column ka sum - ek hi traversal mein
fun rowAndColSums(g: Array<IntArray>): Array<IntArray> {
    val rows = g.size
    val cols = g[0].size
    val rowSum = IntArray(rows) //@init
    val colSum = IntArray(cols)
    for (r in 0 until rows) { // har row
        for (c in 0 until cols) { // us row ka har cell
            rowSum[r] += g[r][c] // row r ka total //@add
            colSum[c] += g[r][c] // column c ka total
        }
    }
    return arrayOf(rowSum, colSum) //@done
}

fun main() {
    val g = arrayOf(
        intArrayOf(1, 2, 3),
        intArrayOf(4, 5, 6),
    )
    val (rowSum, colSum) = rowAndColSums(g)
    println(rowSum.contentToString())
    println(colSum.contentToString())
}

// Output:
// [6, 15]
// [5, 7, 9]
