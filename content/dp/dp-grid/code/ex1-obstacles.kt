// Unique paths, par kuch cells mein stone (1). Stone par dp = 0 - wahan se koi rasta aage nahi jaata
fun uniquePathsWithObstacles(grid: Array<IntArray>): Int {
    val m = grid.size
    val n = grid[0].size
    val dp = Array(m) { IntArray(n) }
    for (i in 0 until m) {
        for (j in 0 until n) {
            if (grid[i][j] == 1) { // stone //@rock
                dp[i][j] = 0
                continue
            }
            if (i == 0 && j == 0) { // shuruaat (stone nahi) - 1 rasta //@start
                dp[i][j] = 1
                continue
            }
            val up = if (i > 0) dp[i - 1][j] else 0 // grid ke bahar se kuch nahi aata
            val left = if (j > 0) dp[i][j - 1] else 0
            dp[i][j] = up + left //@cell
        }
    }
    return dp[m - 1][n - 1]
}

fun main() {
    val g = arrayOf(intArrayOf(0, 0, 0, 0), intArrayOf(0, 1, 0, 0), intArrayOf(0, 0, 0, 1), intArrayOf(1, 0, 0, 0))
    println(uniquePathsWithObstacles(g))
    println(uniquePathsWithObstacles(arrayOf(intArrayOf(1))))
    println(uniquePathsWithObstacles(arrayOf(intArrayOf(0, 1), intArrayOf(0, 0))))
}

// Output:
// 3
// 0
// 1
