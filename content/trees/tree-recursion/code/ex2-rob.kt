class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Har node do jawab bhejta hai: (isko loota, isko chhoda)
fun rob(node: TreeNode?): IntArray {
    if (node == null) return intArrayOf(0, 0)
    val l = rob(node.left)
    val r = rob(node.right)
    val take = node.value + l[1] + r[1] // loota to bachche chhodne padenge //@take
    val skip = maxOf(l[0], l[1]) + maxOf(r[0], r[1]) // chhoda to bachche apna best de //@skip
    return intArrayOf(take, skip)
}

fun robTree(root: TreeNode?): Int {
    val res = rob(root)
    return maxOf(res[0], res[1])
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
    println(robTree(build(3, 4, 5, 1, 3, null, 1)))
    println(robTree(build(3, 2, 3, null, 3, null, 1)))
}

// Output:
// 9
// 7
