// Grid = implicit graph: har khula cell (0) ek node, 8 padosi cells edges. Length = path ke cells
fun shortestPathBinaryMatrix(grid: Array<IntArray>): Int {
    val r = grid.size
    val c = grid[0].size
    if (grid[0][0] == 1 || grid[r - 1][c - 1] == 1) return -1 // shuru ya aakhir hi band //@blocked
    val dist = Array(r) { IntArray(c) } // 0 = abhi nahi pahunche
    val queue = ArrayDeque<IntArray>()
    dist[0][0] = 1 // pehla cell bhi gina jaata hai
    queue.addLast(intArrayOf(0, 0)) //@start
    while (queue.isNotEmpty()) {
        val (x, y) = queue.removeFirst() //@pop
        if (x == r - 1 && y == c - 1) return dist[x][y] // BFS mein pehli baar pahunche = sabse chhota //@found
        for (dx in -1..1) {
            for (dy in -1..1) { // 8 dishayein (0,0 khud ka cell - dist set hai to skip)
                val nx = x + dx
                val ny = y + dy
                if (nx in 0 until r && ny in 0 until c && grid[nx][ny] == 0 && dist[nx][ny] == 0) {
                    dist[nx][ny] = dist[x][y] + 1 //@push
                    queue.addLast(intArrayOf(nx, ny))
                }
            }
        }
    }
    return -1 // aakhri cell tak rasta nahi //@none
}

fun main() {
    val grid = arrayOf(
        intArrayOf(0, 1, 0, 0, 0),
        intArrayOf(0, 1, 0, 1, 0),
        intArrayOf(0, 0, 0, 1, 0),
        intArrayOf(1, 1, 0, 1, 0),
    )
    println(shortestPathBinaryMatrix(grid))
    println(shortestPathBinaryMatrix(arrayOf(intArrayOf(0, 1), intArrayOf(1, 0))))
    println(shortestPathBinaryMatrix(arrayOf(intArrayOf(0, 1), intArrayOf(1, 1))))
}

// Output:
// 8
// 2
// -1
