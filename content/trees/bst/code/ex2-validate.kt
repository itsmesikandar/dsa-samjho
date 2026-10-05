class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Har node ko (lo, hi) range ke andar hona chahiye - upar ki saari shartein
fun valid(node: TreeNode?, lo: Long, hi: Long): Boolean {
    if (node == null) return true
    if (node.value <= lo || node.value >= hi) return false // kisi ancestor ki shart tooti //@bad
    return valid(node.left, lo, node.value.toLong()) && valid(node.right, node.value.toLong(), hi) //@go
}

fun isValidBST(root: TreeNode?): Boolean = valid(root, Long.MIN_VALUE, Long.MAX_VALUE)

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
    println(isValidBST(build(5, 1, 6, null, null, 3, 7)))
    println(isValidBST(build(2, 1, 3)))
}

// Output:
// false
// true
