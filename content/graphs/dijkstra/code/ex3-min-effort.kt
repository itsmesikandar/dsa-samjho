import java.util.PriorityQueue
import kotlin.math.abs

// Rasta utna hi mushkil jitna uska SABSE BADA kadam. Dijkstra, bas "jodo" ki jagah "max lo"
fun minimumEffortPath(heights: Array<IntArray>): Int {
    val r = heights.size
    val c = heights[0].size
    val effort = Array(r) { IntArray(c) { Int.MAX_VALUE } }
    val pq = PriorityQueue<IntArray>(compareBy { it[2] }) // (row, col, effort) - kam effort pehle
    effort[0][0] = 0
    pq.add(intArrayOf(0, 0, 0)) //@start
    val dirs = arrayOf(intArrayOf(1, 0), intArrayOf(-1, 0), intArrayOf(0, 1), intArrayOf(0, -1))
    while (pq.isNotEmpty()) {
        val (x, y, e) = pq.poll() //@poll
        if (e > effort[x][y]) continue // purani entry //@stale
        if (x == r - 1 && y == c - 1) return e // manzil heap se nikli = pakka jawab //@found
        for ((dx, dy) in dirs) {
            val nx = x + dx
            val ny = y + dy
            if (nx !in 0 until r || ny !in 0 until c) continue
            val ne = maxOf(e, abs(heights[nx][ny] - heights[x][y])) // ab tak ka sabse bada kadam //@relax
            if (ne < effort[nx][ny]) {
                effort[nx][ny] = ne //@update
                pq.add(intArrayOf(nx, ny, ne))
            }
        }
    }
    return 0
}

fun main() {
    println(minimumEffortPath(arrayOf(intArrayOf(1, 2, 8), intArrayOf(4, 9, 3), intArrayOf(2, 3, 4))))
    println(minimumEffortPath(arrayOf(intArrayOf(5, 5, 5), intArrayOf(5, 1, 5))))
    println(minimumEffortPath(arrayOf(intArrayOf(7))))
}

// Output:
// 3
// 0
// 0
