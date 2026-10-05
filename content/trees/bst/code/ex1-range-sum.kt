class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// [low, high] ke andar wale nodes ka sum; bekaar subtrees skip
fun rangeSum(node: TreeNode?, low: Int, high: Int): Int {
    if (node == null) return 0
    if (node.value < low) return rangeSum(node.right, low, high) // left aur bhi chhota - skip //@low
    if (node.value > high) return rangeSum(node.left, low, high) // right aur bhi bada - skip //@high
    return node.value + rangeSum(node.left, low, high) + rangeSum(node.right, low, high) //@add
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
    println(rangeSum(build(10, 5, 15, 3, 7, null, 18), 7, 15))
    println(rangeSum(build(10, 5, 15, 3, 7, 13, 18, 1, null, 6), 6, 10))
}

// Output:
// 32
// 23
