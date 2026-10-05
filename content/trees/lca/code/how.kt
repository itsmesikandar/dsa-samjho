class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Har call batata hai: "is subtree mein p / q / unka LCA mila?"
fun lca(node: TreeNode?, p: Int, q: Int): TreeNode? {
    if (node == null || node.value == p || node.value == q) return node // khud p ya q - upar bhejo //@base
    val l = lca(node.left, p, q) //@left
    val r = lca(node.right, p, q)
    if (l != null && r != null) return node // dono taraf mile - raaste yahin milte hain //@both
    return l ?: r // ek taraf se jo aaya wahi upar //@one
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
    println(lca(root, 6, 4)?.value)
    println(lca(root, 5, 4)?.value)
}

// Output:
// 5
// 5
