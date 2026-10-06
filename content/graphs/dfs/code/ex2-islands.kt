// Zameen ('1') ka har naya tukda = ek island. DFS se poora tukda "dooba do" ('0') taaki dobara na gine
fun sink(grid: Array<CharArray>, i: Int, j: Int) {
    if (i < 0 || j < 0 || i >= grid.size || j >= grid[0].size || grid[i][j] != '1') return // bahar / paani / pehle dooba //@stop
    grid[i][j] = '0' // dooba diya - yahi visited ka kaam karta hai //@mark
    sink(grid, i + 1, j)
    sink(grid, i - 1, j)
    sink(grid, i, j + 1)
    sink(grid, i, j - 1)
}

fun numIslands(grid: Array<CharArray>): Int {
    var count = 0
    for (i in grid.indices) {
        for (j in grid[0].indices) {
            if (grid[i][j] == '1') { // abhi tak kisi DFS ne nahi dubaya - naya island //@found
                count++
                sink(grid, i, j) //@sink
            }
        }
    }
    return count //@done
}

fun main() {
    val grid = arrayOf("11000", "11010", "00100", "00011").map { it.toCharArray() }.toTypedArray()
    println(numIslands(grid))
    println(numIslands(arrayOf("111", "010", "111").map { it.toCharArray() }.toTypedArray()))
    println(numIslands(arrayOf("000").map { it.toCharArray() }.toTypedArray()))
}

// Output:
// 4
// 1
// 0
