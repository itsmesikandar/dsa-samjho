// Matrix ko spiral (gol-gol, bahar se andar) order mein padho
fun spiral(m: Array<IntArray>): List<Int> {
    val res = ArrayList<Int>()
    var top = 0 //@init
    var bottom = m.size - 1
    var left = 0
    var right = m[0].size - 1
    while (top <= bottom && left <= right) {
        for (c in left..right) res.add(m[top][c]) // upar wali row: left -> right //@top
        top++
        for (r in top..bottom) res.add(m[r][right]) // right column: upar -> neeche //@right
        right--
        if (top <= bottom) { // abhi koi row bachi hai?
            for (c in right downTo left) res.add(m[bottom][c]) // neeche wali row: right -> left //@bottom
            bottom--
        }
        if (left <= right) { // abhi koi column bacha hai?
            for (r in bottom downTo top) res.add(m[r][left]) // left column: neeche -> upar //@left
            left++
        }
    }
    return res //@done
}

fun main() {
    val m = arrayOf(
        intArrayOf(1, 2, 3, 4),
        intArrayOf(5, 6, 7, 8),
        intArrayOf(9, 10, 11, 12),
    )
    println(spiral(m))
}

// Output:
// [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
