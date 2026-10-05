class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Level by level: har level ki values alag list mein
fun levelOrder(root: TreeNode?): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    if (root == null) return res
    val q = ArrayDeque<TreeNode>()
    q.addLast(root) //@start
    while (q.isNotEmpty()) {
        val size = q.size // ABHI queue mein jitne hain = poora ek level (naye bachche baad mein aayenge) //@level
        val level = mutableListOf<Int>()
        repeat(size) {
            val n = q.removeFirst() //@pop
            level.add(n.value)
            n.left?.let { q.addLast(it) } // bachche agle level ke liye peeche lagte hain //@push
            n.right?.let { q.addLast(it) }
        }
        res.add(level) //@done
    }
    return res
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
    println(levelOrder(build(3, 9, 20, null, null, 15, 7)))
    println(levelOrder(build(1)))
}

// Output:
// [[3], [9, 20], [15, 7]]
// [[1]]
