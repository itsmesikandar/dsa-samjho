// 3 color: 0 = white (untouched), 1 = gray (abhi DFS ke raste par), 2 = black (poora ho gaya)
fun dfs(u: Int, adj: List<List<Int>>, color: IntArray, post: MutableList<Int>): Boolean { // true = cycle
    color[u] = 1 // gray: u abhi raste par hai //@gray
    for (v in adj[u]) {
        if (color[v] == 1) return true // raste wale node par wapas = back edge = cycle //@cycle
        if (color[v] == 0 && dfs(v, adj, color, post)) return true //@go
    }
    color[u] = 2 // black: u ke baad aane wale sab ho gaye //@black
    post.add(u) // postorder: u apne saare "baad walon" ke BAAD list mein
    return false
}

fun findOrder(numCourses: Int, prerequisites: Array<IntArray>): IntArray {
    val adj = List(numCourses) { mutableListOf<Int>() }
    for ((course, pre) in prerequisites) adj[pre].add(course)
    val color = IntArray(numCourses)
    val post = mutableListOf<Int>()
    for (c in 0 until numCourses) {
        if (color[c] == 0 && dfs(c, adj, color, post)) return IntArray(0) // cycle - koi order nahi //@start
    }
    return post.reversed().toIntArray() // ulta postorder = topological order //@done
}

fun main() {
    val pre = arrayOf(intArrayOf(1, 0), intArrayOf(2, 0), intArrayOf(3, 1), intArrayOf(3, 2), intArrayOf(4, 3), intArrayOf(4, 5))
    println(findOrder(6, pre).contentToString())
    println(findOrder(3, arrayOf(intArrayOf(1, 0), intArrayOf(2, 1), intArrayOf(0, 2))).contentToString())
    println(findOrder(1, arrayOf()).contentToString())
}

// Output:
// [5, 0, 2, 1, 3, 4]
// []
// [0]
