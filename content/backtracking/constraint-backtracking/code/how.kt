// n x n board par n queens aise rakho ki koi kisi ko na maare (row, column, diagonal). Saare boards.
fun solveNQueens(n: Int): List<List<String>> {
    val res = mutableListOf<List<String>>()
    val queenCol = IntArray(n) // row r ki queen kis column mein
    val cols = BooleanArray(n) // column mein queen hai?
    val d1 = BooleanArray(2 * n) // ek diagonal par (r - c) same rehta hai: index r - c + n
    val d2 = BooleanArray(2 * n) // doosre diagonal par (r + c) same rehta hai
    fun place(r: Int) {
        if (r == n) { // har row mein ek queen: board taiyaar //@found
            res.add(queenCol.map { c -> ".".repeat(c) + "Q" + ".".repeat(n - c - 1) })
            return
        }
        for (c in 0 until n) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue // yahan rakhi to koi maar dega - O(1) check //@check
            queenCol[r] = c //@place
            cols[c] = true
            d1[r - c + n] = true
            d2[r + c] = true
            place(r + 1) // agli row
            cols[c] = false // queen uthao: doosra column try karne ke liye //@remove
            d1[r - c + n] = false
            d2[r + c] = false
        }
    }
    place(0)
    return res
}

fun main() {
    println(solveNQueens(4))
    println(solveNQueens(1))
    println(solveNQueens(8).size)
}

// Output:
// [[.Q.., ...Q, Q..., ..Q.], [..Q., Q..., ...Q, .Q..]]
// [[Q]]
// 92
