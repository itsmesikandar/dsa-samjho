class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Node 'good' hai agar root se us tak ke raaste mein koi bhi usse BADA nahi. Kitne good nodes?
fun goodNodes(root: TreeNode?): Int {
    fun dfs(node: TreeNode?, maxSoFar: Int): Int { // upar se neeche: raaste ka max saath le chalo
        if (node == null) return 0 //@base
        val good = if (node.value >= maxSoFar) 1 else 0 // raaste mein mujhse bada koi nahi? //@check
        val m = maxOf(maxSoFar, node.value) // bachchon ke liye naya max
        return good + dfs(node.left, m) + dfs(node.right, m) //@recurse
    }
    return dfs(root, Int.MIN_VALUE)
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
    println(goodNodes(build(3, 1, 4, 3, null, 1, 5)))
    println(goodNodes(build(3, 3, null, 4, 2)))
}

// Output:
// 4
// 3
