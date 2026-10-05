class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Tree ka mirror image: har node ke left aur right adla-badli
fun invertTree(root: TreeNode?): TreeNode? {
    if (root == null) return null //@base
    val l = invertTree(root.left) // pehle dono subtrees khud ulte ho jaayein //@recurse
    val r = invertTree(root.right)
    root.left = r // phir apne bachche adla-badli //@swap
    root.right = l
    return root
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

fun serialize(root: TreeNode?): List<Int?> {
    val out = mutableListOf<Int?>()
    val q = ArrayDeque<TreeNode?>()
    q.addLast(root)
    while (q.isNotEmpty()) {
        val n = q.removeFirst()
        if (n == null) {
            out.add(null)
            continue
        }
        out.add(n.value)
        q.addLast(n.left)
        q.addLast(n.right)
    }
    while (out.isNotEmpty() && out.last() == null) out.removeAt(out.size - 1)
    return out
}

fun main() {
    println(serialize(invertTree(build(4, 2, 7, 1, 3, 6, 9))))
    println(serialize(invertTree(build(2, 1, 3))))
}

// Output:
// [4, 7, 2, 9, 6, 3, 1]
// [2, 3, 1]
