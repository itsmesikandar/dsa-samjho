class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Return: (is subtree ki height, sabse deep leaves ka LCA)
fun deep(node: TreeNode?): Pair<Int, TreeNode?> {
    if (node == null) return Pair(0, null)
    val l = deep(node.left)
    val r = deep(node.right)
    if (l.first == r.first) return Pair(l.first + 1, node) // dono taraf barabar deep - yahi LCA //@tie
    return if (l.first > r.first) Pair(l.first + 1, l.second) else Pair(r.first + 1, r.second) // deep taraf ka jawab //@deeper
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
    println(deep(build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4)).second?.value)
    println(deep(build(0, 1, 3, null, 2)).second?.value)
}

// Output:
// 2
// 2
