class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Inorder (Left, Node, Right) bina recursion - apna stack
fun inorder(root: TreeNode?): List<Int> {
    val res = mutableListOf<Int>()
    val st = ArrayDeque<TreeNode>()
    var cur = root
    while (cur != null || st.isNotEmpty()) {
        while (cur != null) { // jitna ho sake baayein jao; raaste ke nodes stack par (inhe baad mein dekhna hai) //@push
            st.addLast(cur)
            cur = cur.left
        }
        val node = st.removeLast() // left poora ho gaya: ab ye node //@visit
        res.add(node.value)
        cur = node.right // ab iska right subtree - wahi process //@right
    }
    return res
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
    println(inorder(build(4, 2, 6, 1, 3, 5, 7))) // BST ka inorder = sorted!
    println(inorder(build(1, null, 2, 3)))
}

// Output:
// [1, 2, 3, 4, 5, 6, 7]
// [1, 3, 2]
