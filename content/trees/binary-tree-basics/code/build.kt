class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Level order list -> tree. Queue mein woh nodes jinke bachche abhi lagne hain.
fun build(vararg xs: Int?): TreeNode? {
    if (xs.isEmpty() || xs[0] == null) return null
    val root = TreeNode(xs[0]!!)
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)
    var i = 1
    while (q.isNotEmpty() && i < xs.size) {
        val p = q.removeFirst() // agla parent
        xs[i]?.let { p.left = TreeNode(it).also(q::addLast) } // null = khaali jagah
        i++
        if (i < xs.size) xs[i]?.let { p.right = TreeNode(it).also(q::addLast) }
        i++
    }
    return root
}

// Tree -> level order list (wapas), aakhir ke null hata ke
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

fun count(root: TreeNode?): Int = if (root == null) 0 else 1 + count(root.left) + count(root.right)

fun main() {
    val t = build(3, 9, 20, null, null, 15, 7)
    println(serialize(t))
    println(count(t))
}

// Output:
// [3, 9, 20, null, null, 15, 7]
// 5
