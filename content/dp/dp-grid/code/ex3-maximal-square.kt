// dp[i][j] = (i, j) jiska NEECHE-DAAYAN kona hai, aise sabse bade '1' square ki side
fun maximalSquare(matrix: Array<CharArray>): Int {
    val m = matrix.size
    val n = matrix[0].size
    val dp = Array(m + 1) { IntArray(n + 1) } // ek extra row/col 0 - edge ke if khatam
    var side = 0
    for (i in 1..m) {
        for (j in 1..n) {
            if (matrix[i - 1][j - 1] == '1') { //@check
                dp[i][j] = minOf(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1 // upar, left, diagonal - sabse chhota hi badhega //@cell
                side = maxOf(side, dp[i][j])
            }
        }
    }
    return side * side //@done
}

fun main() {
    val mat = arrayOf("0111", "1111", "1111", "0110").map { it.toCharArray() }.toTypedArray()
    println(maximalSquare(mat))
    println(maximalSquare(arrayOf(charArrayOf('0'))))
    println(maximalSquare(arrayOf(charArrayOf('1'))))
}

// Output:
// 9
// 0
// 1
