class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Koi root-se-leaf raasta hai jiske nodes ka sum = target?
fun hasPathSum(root: TreeNode?, target: Int): Boolean {
    if (root == null) return false //@base
    val remain = target - root.value // apna hissa ghatao, baaki bachchon se maango //@visit
    if (root.left == null && root.right == null) return remain == 0 // leaf par hisaab poora hua? //@leaf
    return hasPathSum(root.left, remain) || hasPathSum(root.right, remain) //@recurse
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
    println(hasPathSum(build(5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1), 22))
    println(hasPathSum(build(1, 2, 3), 5))
}

// Output:
// true
// false
