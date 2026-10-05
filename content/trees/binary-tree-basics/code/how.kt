class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Tree ki height (max depth): root se sabse door leaf tak kitne nodes
fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0 // khaali tree ki height 0 //@base
    val l = maxDepth(root.left) // left subtree ki height - bharosa karo //@left
    val r = maxDepth(root.right) //@right
    return 1 + maxOf(l, r) // main khud (1) + dono mein se lamba //@combine
}

// LeetCode jaisa level order (null = khaali) se tree banao
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
    println(maxDepth(build(3, 9, 20, null, null, 15, 7)))
    println(maxDepth(build(1, null, 2)))
    println(maxDepth(build()))
}

// Output:
// 3
// 2
// 0
