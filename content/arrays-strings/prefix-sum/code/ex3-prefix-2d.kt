// 2D prefix sum: kisi bhi rectangle ka sum O(1) mein
class Matrix2DSum(g: Array<IntArray>) {
    // ek extra row aur column (index 0) jisme sab 0 - edge cases ki chinta khatam
    private val pre = Array(g.size + 1) { LongArray(g[0].size + 1) } //@alloc

    init {
        for (r in g.indices) {
            for (c in g[0].indices) {
                // apna cell + upar wala total + left wala total - dono mein gina hua kona
                pre[r + 1][c + 1] = g[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c] //@build
            }
        }
    }

    // (r1, c1) se (r2, c2) tak ka rectangle (dono kone include)
    fun sum(r1: Int, c1: Int, r2: Int, c2: Int): Long {
        return pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1] //@query
    }
}

fun main() {
    val m = Matrix2DSum(
        arrayOf(
            intArrayOf(3, 0, 1, 4),
            intArrayOf(5, 6, 3, 2),
            intArrayOf(1, 2, 0, 1),
        ),
    )
    println(m.sum(1, 1, 2, 2)) // 6 + 3 + 2 + 0
    println(m.sum(0, 0, 2, 3)) // poora grid
}

// Output:
// 11
// 28
