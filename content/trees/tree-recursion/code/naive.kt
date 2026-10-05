import kotlin.math.abs

class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

var visits = 0

fun height(node: TreeNode?): Int {
    if (node == null) return 0
    visits++
    return 1 + maxOf(height(node.left), height(node.right))
}

// Seedha tareeka: har node par dono subtrees ki height phir se nikaalo
fun isBalancedNaive(node: TreeNode?): Boolean {
    if (node == null) return true
    if (abs(height(node.left) - height(node.right)) > 1) return false
    return isBalancedNaive(node.left) && isBalancedNaive(node.right)
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
    println(isBalancedNaive(build(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)))
    println("visits = $visits") // 10 nodes, par 19 baar gine
}

// Output:
// true
// visits = 19
