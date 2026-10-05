class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Root se x tak ka raasta path mein bharo; mila to true
fun pathTo(node: TreeNode?, x: Int, path: MutableList<Int>): Boolean {
    if (node == null) return false
    path.add(node.value)
    if (node.value == x || pathTo(node.left, x, path) || pathTo(node.right, x, path)) return true
    path.removeAt(path.size - 1) // is taraf nahi mila - wapas (backtrack)
    return false
}

// Dono raaste nikaalo; jahan tak same, uska aakhri = LCA
fun lcaByPaths(root: TreeNode?, p: Int, q: Int): Int {
    val a = mutableListOf<Int>()
    val b = mutableListOf<Int>()
    pathTo(root, p, a)
    pathTo(root, q, b)
    var k = 0
    while (k < a.size && k < b.size && a[k] == b[k]) k++
    return a[k - 1]
}

fun build(vararg xs: Int?): TreeNode? {
    if (xs.isEmpty() || xs[0] == null) return null
    val root = TreeNode(xs[0]!!)
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)
    var i = 1
    while (q.isNotEmpty() && i < xs.size) {
        val p = q.removeFirst()
        xs[i]?.let { p.left = TreeNode(it).also(q::addLast) }
        i++
        if (i < xs.size) xs[i]?.let { p.right = TreeNode(it).also(q::addLast) }
        i++
    }
    return root
}

fun main() {
    val root = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4)
    println(lcaByPaths(root, 7, 6))
    println(lcaByPaths(root, 7, 8))
}

// Output:
// 5
// 3
