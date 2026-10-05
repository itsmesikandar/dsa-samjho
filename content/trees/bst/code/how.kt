class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Search ka raasta pakdo; jahan null mile wahi naye node ki jagah
fun insert(node: TreeNode?, key: Int): TreeNode {
    if (node == null) return TreeNode(key) // khaali jagah - naya node yahin //@new
    if (key < node.value) node.left = insert(node.left, key) // chhota - left mein dhoondho //@left
    else if (key > node.value) node.right = insert(node.right, key) // bada - right mein //@right
    return node // barabar ho to pehle se hai - kuch mat karo //@same
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
    val root = insert(build(8, 3, 10, 1, 6, null, 14, null, null, 4, 7), 5)
    println(preorder(root))
    var t: TreeNode? = null
    for (x in intArrayOf(4, 2, 6, 1)) t = insert(t, x)
    println(preorder(t))
}

// Output:
// [8, 3, 1, 6, 4, 5, 7, 10, 14]
// [4, 2, 1, 6]
