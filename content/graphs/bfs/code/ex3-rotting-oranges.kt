// Multi-source BFS: saare sade santre ek saath queue mein. Ek level = ek minute
fun orangesRotting(grid: Array<IntArray>): Int {
    val r = grid.size
    val c = grid[0].size
    val queue = ArrayDeque<IntArray>()
    var fresh = 0
    for (i in 0 until r) {
        for (j in 0 until c) {
            if (grid[i][j] == 2) queue.addLast(intArrayOf(i, j)) // har sada santra ek source //@sources
            else if (grid[i][j] == 1) fresh++
        }
    }
    val dirs = arrayOf(intArrayOf(1, 0), intArrayOf(-1, 0), intArrayOf(0, 1), intArrayOf(0, -1))
    var minutes = 0
    while (queue.isNotEmpty() && fresh > 0) {
        minutes++ // naya level = naya minute //@minute
        repeat(queue.size) { // sirf is minute ke sade santre
            val (x, y) = queue.removeFirst()
            for ((dx, dy) in dirs) {
                val nx = x + dx
                val ny = y + dy
                if (nx in 0 until r && ny in 0 until c && grid[nx][ny] == 1) {
                    grid[nx][ny] = 2 // padosi sad gaya - grid hi visited ka kaam karta hai //@rot
                    fresh--
                    queue.addLast(intArrayOf(nx, ny))
                }
            }
        }
    }
    return if (fresh == 0) minutes else -1 // koi taaza santra pahunch se bahar //@done
}

fun main() {
    println(orangesRotting(arrayOf(intArrayOf(2, 1, 0, 2), intArrayOf(1, 1, 0, 1), intArrayOf(0, 1, 1, 1))))
    println(orangesRotting(arrayOf(intArrayOf(2, 0, 1))))
    println(orangesRotting(arrayOf(intArrayOf(0, 2))))
}

// Output:
// 3
// -1
// 0
