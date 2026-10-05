class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Binary search jaisa: har node par ek taraf hi jao
fun search(root: TreeNode?, key: Int): TreeNode? {
    var cur = root
    while (cur != null && cur.value != key)
        cur = if (key < cur.value) cur.left else cur.right
    return cur
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
    val root = build(8, 3, 10, 1, 6, null, 14, null, null, 4, 7)
    println(search(root, 6) != null)
    println(search(root, 5) != null)
}

// Output:
// true
// false
