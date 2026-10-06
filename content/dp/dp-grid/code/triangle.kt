// Triangle: upar se neeche, har row mein neeche ke do padosiyon mein se ek. Neeche se upar chalo - ek hi 1D array kaafi
fun minimumTotal(triangle: List<List<Int>>): Int {
    val dp = triangle.last().toIntArray() // aakhri row hi shuruaat
    for (r in triangle.size - 2 downTo 0) {
        for (c in 0..r) {
            dp[c] = triangle[r][c] + minOf(dp[c], dp[c + 1]) // neeche ke do mein sasta (dp[c] abhi purani row ka hai)
        }
    }
    return dp[0]
}

fun main() {
    println(minimumTotal(listOf(listOf(3), listOf(7, 4), listOf(2, 4, 6), listOf(8, 5, 9, 3))))
    println(minimumTotal(listOf(listOf(-10))))
}

// Output:
// 16
// -10
