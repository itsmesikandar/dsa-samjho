// Rat (0,0) se (n-1,n-1) jaana chahta hai. 1 = khula, 0 = wall. Move: D, L, R, U. Saare raaste.
fun findPaths(m: Array<IntArray>): List<String> {
    val n = m.size
    val res = mutableListOf<String>()
    if (m[0][0] == 0 || m[n - 1][n - 1] == 0) return res
    val seen = Array(n) { BooleanArray(n) }
    val dr = intArrayOf(1, 0, 0, -1) // D, L, R, U - alphabetical order, to raaste bhi sorted milenge
    val dc = intArrayOf(0, -1, 1, 0)
    val dir = "DLRU"
    val path = StringBuilder()
    fun go(r: Int, c: Int) {
        if (r == n - 1 && c == n - 1) {
            res.add(path.toString())
            return
        }
        seen[r][c] = true // is raaste par yahan dobara nahi aana (warna gol-gol ghoomte rahenge)
        for (k in 0 until 4) {
            val nr = r + dr[k]
            val nc = c + dc[k]
            if (nr in 0 until n && nc in 0 until n && m[nr][nc] == 1 && !seen[nr][nc]) {
                path.append(dir[k])
                go(nr, nc)
                path.deleteCharAt(path.length - 1)
            }
        }
        seen[r][c] = false // wapas jaate time cell phir khula - doosre raaste isse guzar sakein
    }
    go(0, 0)
    return res
}

fun main() {
    val maze = arrayOf(
        intArrayOf(1, 0, 0, 0),
        intArrayOf(1, 1, 0, 1),
        intArrayOf(1, 1, 0, 0),
        intArrayOf(0, 1, 1, 1),
    )
    println(findPaths(maze))
}

// Output:
// [DDRDRR, DRDDRR]
