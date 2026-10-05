// Letters ki grid mein word hai? Letters padosi cells (upar/neeche/baayein/daayein) se, ek cell ek hi baar.
fun exist(board: Array<CharArray>, word: String): Boolean {
    val m = board.size
    val n = board[0].size
    fun dfs(r: Int, c: Int, k: Int): Boolean {
        if (k == word.length) return true // saare letters mil gaye //@found
        if (r !in 0 until m || c !in 0 until n || board[r][c] != word[k]) return false // bahar ya letter galat //@stop
        val ch = board[r][c]
        board[r][c] = '#' // is raaste par ye cell use ho gaya - dobara nahi //@mark
        val ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1)
        board[r][c] = ch // wapas: doosre raaston ke liye phir khula //@unmark
        return ok
    }
    for (r in 0 until m) for (c in 0 until n) if (dfs(r, c, 0)) return true // har cell se shuru karke dekho
    return false
}

fun main() {
    val board = arrayOf(
        charArrayOf('A', 'B', 'C', 'E'),
        charArrayOf('S', 'F', 'C', 'S'),
        charArrayOf('A', 'D', 'E', 'E'),
    )
    println(exist(board, "ABCCED"))
    println(exist(board, "SEE"))
    println(exist(board, "ABCB")) // B dobara use nahi kar sakte
}

// Output:
// true
// true
// false
