import kotlin.math.abs

class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Height bhejo, ya -1 agar neeche kahin balance toota
fun check(node: TreeNode?): Int {
    if (node == null) return 0
    val l = check(node.left) //@left
    if (l == -1) return -1 // neeche toota - right dekhne ki zaroorat nahi //@cut
    val r = check(node.right)
    if (r == -1) return -1
    if (abs(l - r) > 1) return -1 // yahin toota //@diff
    return 1 + maxOf(l, r) // theek hai - parent ko height chahiye //@ret
}

fun isBalanced(root: TreeNode?): Boolean = check(root) != -1

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
    println(isBalanced(build(1, 2, 3, 4, null, null, null, 5)))
    println(isBalanced(build(3, 9, 20, null, null, 15, 7)))
}

// Output:
// false
// true
