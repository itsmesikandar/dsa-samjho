fun main() {
    val rows = 3
    val cols = 4
    // 3 rows, har row mein 4 columns. Har cell mein uska "flat index" r * cols + c
    val grid = Array(rows) { r -> IntArray(cols) { c -> r * cols + c } }
    println(grid.contentDeepToString())
    println(grid[1][2]) // row 1, column 2

    // 4 neighbor (upar, neeche, left, right) - direction arrays se
    val dr = intArrayOf(-1, 1, 0, 0)
    val dc = intArrayOf(0, 0, -1, 1)
    val r = 0
    val c = 0
    val nbrs = ArrayList<Int>()
    for (k in 0 until 4) {
        val nr = r + dr[k]
        val nc = c + dc[k]
        if (nr in 0 until rows && nc in 0 until cols) nbrs.add(grid[nr][nc]) // grid ke bahar? to chhodo
    }
    println(nbrs) // corner (0,0) ke sirf 2 valid neighbor
}

// Output:
// [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]
// 6
// [4, 1]
