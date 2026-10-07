class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Tree ko RIGHT se dekho: har level ka sabse right node dikhega. Upar se neeche woh values.
fun rightSideView(root: TreeNode?): List<Int> {
    val res = mutableListOf<Int>()
    if (root == null) return res
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)
    while (q.isNotEmpty()) {
        val size = q.size
        for (k in 0 until size) {
            val n = q.removeFirst()
            if (k == size - 1) res.add(n.value) // level ka AAKHRI = sabse right //@last
            n.left?.let { q.addLast(it) } //@push
            n.right?.let { q.addLast(it) }
        }
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
    println(rightSideView(build(1, 2, 3, null, 5, null, 4, 6))) // 6 left bachcha hai par us level par akela - dikhega
    println(rightSideView(build(1, 2, 3, 4)))
}

// Output:
// [1, 3, 4, 6]
// [1, 3, 4]
