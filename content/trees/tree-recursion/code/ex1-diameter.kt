class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

var best = 0

// Return = height; jawab (best) har node par update
fun height(node: TreeNode?): Int {
    if (node == null) return 0
    val l = height(node.left)
    val r = height(node.right)
    best = maxOf(best, l + r) // raasta jo is node par mudta hai: l + r edges //@best
    return 1 + maxOf(l, r) // parent ko sirf ek taraf ki height //@ret
}

fun diameter(root: TreeNode?): Int {
    best = 0
    height(root)
    return best
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
    println(diameter(build(1, 2, 3, 4, 5, null, null, 6, null, null, 7, 8, null, null, 9)))
    println(diameter(build(1, 2, 3, 4, 5)))
}

// Output:
// 6
// 3
