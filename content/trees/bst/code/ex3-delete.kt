class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// key hatao, naye subtree ka root return karo
fun delete(node: TreeNode?, key: Int): TreeNode? {
    if (node == null) return null // key tree mein hai hi nahi //@miss
    if (key < node.value) node.left = delete(node.left, key) //@left
    else if (key > node.value) node.right = delete(node.right, key) //@right
    else {
        if (node.left == null) return node.right // 0 ya 1 bachcha: bachcha jagah le //@one
        if (node.right == null) return node.left
        var s = node.right!! // 2 bachche: right subtree ka sabse chhota (successor) //@succ
        while (s.left != null) s = s.left!!
        node.value = s.value // successor ki value yahan copy //@copy
        node.right = delete(node.right, s.value) // purana successor hatao (uska left nahi hota) //@again
    }
    return node
}

fun preorder(node: TreeNode?, out: MutableList<Int> = mutableListOf()): List<Int> {
    if (node != null) {
        out.add(node.value)
        preorder(node.left, out)
        preorder(node.right, out)
    }
    return out
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
    println(preorder(delete(build(8, 3, 12, 1, 6, 10, 15, null, null, null, null, null, 11), 8)))
    println(preorder(delete(build(5, 3, 6, 2, 4, null, 7), 6)))
}

// Output:
// [10, 3, 1, 6, 12, 11, 15]
// [5, 3, 2, 4, 7]
