// Sudoku solve karo (0 = khaali). Generic: n = 4 (2x2 boxes) ya 9 (3x3 boxes).
fun solveSudoku(b: Array<IntArray>): Boolean {
    val n = b.size
    var box = 1
    while (box * box < n) box++ // 4 -> 2, 9 -> 3
    for (r in 0 until n) for (c in 0 until n) {
        if (b[r][c] != 0) continue
        for (d in 1..n) {
            if (canPlace(b, r, c, d, box)) { // row, column, box mein d pehle se nahi //@check
                b[r][c] = d //@place
                if (solveSudoku(b)) return true // aage sab ho gaya
                b[r][c] = 0 // aage raasta band hua: ye digit galat tha, wapas //@undo
            }
        }
        return false // is khaali cell mein koi digit nahi chala: PICHHLA decision galat tha //@dead
    }
    return true // koi khaali cell nahi bacha: solved //@solved
}

fun canPlace(b: Array<IntArray>, r: Int, c: Int, d: Int, box: Int): Boolean {
    for (i in b.indices) if (b[r][i] == d || b[i][c] == d) return false // row ya column mein
    val br = r / box * box
    val bc = c / box * box
    for (i in br until br + box) for (j in bc until bc + box) if (b[i][j] == d) return false // apne box mein
    return true
}

fun main() {
    val small = arrayOf(
        intArrayOf(1, 0, 3, 0),
        intArrayOf(0, 4, 0, 2),
        intArrayOf(2, 0, 4, 0),
        intArrayOf(0, 3, 0, 1),
    )
    solveSudoku(small)
    small.forEach { println(it.joinToString(" ")) }
    val big = arrayOf(
        intArrayOf(5, 3, 0, 0, 7, 0, 0, 0, 0),
        intArrayOf(6, 0, 0, 1, 9, 5, 0, 0, 0),
        intArrayOf(0, 9, 8, 0, 0, 0, 0, 6, 0),
        intArrayOf(8, 0, 0, 0, 6, 0, 0, 0, 3),
        intArrayOf(4, 0, 0, 8, 0, 3, 0, 0, 1),
        intArrayOf(7, 0, 0, 0, 2, 0, 0, 0, 6),
        intArrayOf(0, 6, 0, 0, 0, 0, 2, 8, 0),
        intArrayOf(0, 0, 0, 4, 1, 9, 0, 0, 5),
        intArrayOf(0, 0, 0, 0, 8, 0, 0, 7, 9),
    )
    solveSudoku(big)
    println(big[0].joinToString(" "))
    println(big[8].joinToString(" "))
}

// Output:
// 1 2 3 4
// 3 4 1 2
// 2 1 4 3
// 4 3 2 1
// 5 3 4 6 7 8 9 1 2
// 3 4 5 2 8 6 1 7 9
