class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Root se SABSE PAAS wali leaf tak kitne nodes?
fun minDepth(root: TreeNode?): Int {
    if (root == null) return 0
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)
    var depth = 0
    while (q.isNotEmpty()) {
        depth++ // naya level shuru //@level
        repeat(q.size) {
            val n = q.removeFirst()
            if (n.left == null && n.right == null) return depth // BFS mein pehli leaf = sabse paas wali: yahin ruko //@leaf
            n.left?.let { q.addLast(it) } //@push
            n.right?.let { q.addLast(it) }
        }
    }
    return depth
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
    println(minDepth(build(1, 2, 3, 4, 5, null, 6, 7, null, null, null, 8)))
    println(minDepth(build(2, null, 3, null, 4, null, 5, null, 6))) // ek hi leaf, sabse neeche
}

// Output:
// 3
// 5
