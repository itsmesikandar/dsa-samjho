class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun lca(node: TreeNode?, p: Int, q: Int): TreeNode? {
    if (node == null || node.value == p || node.value == q) return node
    val l = lca(node.left, p, q)
    val r = lca(node.right, p, q)
    if (l != null && r != null) return node
    return l ?: r
}

// node se x kitne edges neeche hai (nahi mila to -1)
fun depth(node: TreeNode?, x: Int, d: Int): Int {
    if (node == null) return -1
    if (node.value == x) return d //@found
    val l = depth(node.left, x, d + 1) // bachchon mein ek kadam aur //@down
    return if (l != -1) l else depth(node.right, x, d + 1)
}

// p se q: upar LCA tak, phir neeche q tak
fun distance(root: TreeNode?, p: Int, q: Int): Int {
    val a = lca(root, p, q) // raasta yahin mudta hai //@lca
    return depth(a, p, 0) + depth(a, q, 0) //@sum
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
    val root = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4)
    println(distance(root, 7, 0))
    println(distance(root, 6, 4))
}

// Output:
// 5
// 3
