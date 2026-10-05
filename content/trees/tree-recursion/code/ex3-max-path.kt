class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

var best = Int.MIN_VALUE

// Return = is node se neeche ek taraf ka sabse accha sum (gain)
fun gain(node: TreeNode?): Int {
    if (node == null) return 0
    val l = maxOf(0, gain(node.left)) // negative gain se nuksaan - mat jodo
    val r = maxOf(0, gain(node.right))
    best = maxOf(best, node.value + l + r) // raasta jo yahan mudta hai //@best
    return node.value + maxOf(l, r) // parent ko sirf ek taraf //@ret
}

fun maxPathSum(root: TreeNode?): Int {
    best = Int.MIN_VALUE
    gain(root)
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
    println(maxPathSum(build(-10, 9, 20, null, null, 15, 7)))
    println(maxPathSum(build(-3)))
}

// Output:
// 42
// -3
