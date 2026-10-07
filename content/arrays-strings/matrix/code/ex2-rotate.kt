// n x n matrix ko 90 degree clockwise rotate karo - usi matrix mein (in-place)
fun rotate(m: Array<IntArray>) {
    val n = m.size
    // Step 1: transpose - diagonal ke upar wale cell ko neeche wale se swap
    for (i in 0 until n) {
        for (j in i + 1 until n) {
            val t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t //@transpose
        }
    }
    // Step 2: har row ko ulta karo
    for (row in m) {
        var l = 0
        var r = n - 1
        while (l < r) {
            val t = row[l]; row[l] = row[r]; row[r] = t //@reverse
            l++
            r--
        }
    }
}

fun main() {
    val m = arrayOf(intArrayOf(1, 2, 3), intArrayOf(4, 5, 6), intArrayOf(7, 8, 9))
    rotate(m)
    println(m.contentDeepToString())
}

// Output:
// [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
