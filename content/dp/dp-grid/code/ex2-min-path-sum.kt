// Har cell ka kharcha. Neeche / daayein chal ke kam se kam jod. dp[i][j] = (i, j) tak ka sabse sasta rasta
fun minPathSum(grid: Array<IntArray>): Int {
    val m = grid.size
    val n = grid[0].size
    val dp = Array(m) { IntArray(n) }
    for (i in 0 until m) {
        for (j in 0 until n) {
            dp[i][j] = grid[i][j] + when {
                i == 0 && j == 0 -> 0 // shuruaat //@start
                i == 0 -> dp[i][j - 1] // pehli row: sirf baayein se
                j == 0 -> dp[i - 1][j] // pehla column: sirf upar se
                else -> minOf(dp[i - 1][j], dp[i][j - 1]) // dono mein sasta //@cell
            }
        }
    }
    return dp[m - 1][n - 1] //@done
}

fun main() {
    val g = arrayOf(intArrayOf(2, 1, 4), intArrayOf(3, 8, 1), intArrayOf(5, 2, 6), intArrayOf(1, 4, 3))
    println(minPathSum(g))
    println(minPathSum(arrayOf(intArrayOf(5))))
}

// Output:
// 17
// 5
