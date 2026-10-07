class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Level ki width = sabse left aur sabse right node ke beech ki saari jagahen (beech ke khaali bhi). Max width?
fun widthOfBinaryTree(root: TreeNode?): Int {
    if (root == null) return 0
    val q = ArrayDeque<Pair<TreeNode, Long>>() // node + position (complete tree jaisa: bachche 2i aur 2i + 1)
    q.addLast(root to 0L)
    var best = 0L
    while (q.isNotEmpty()) {
        val size = q.size
        val first = q.first().second // is level ka sabse left position //@level
        var last = 0L
        repeat(size) {
            val (n, idx) = q.removeFirst()
            val i = idx - first // har level par 0 se count karo - warna deep tree mein numbers overflow //@pos
            last = i
            n.left?.let { q.addLast(it to 2 * i) } //@push
            n.right?.let { q.addLast(it to 2 * i + 1) }
        }
        best = maxOf(best, last + 1) // aakhri - pehla + 1 //@width
    }
    return best.toInt()
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
    println(widthOfBinaryTree(build(1, 3, 2, 5, null, null, 9, 6, null, 7)))
    println(widthOfBinaryTree(build(1, 3, 2, 5, 3, null, 9)))
    println(widthOfBinaryTree(build(1, 3, 2, 5)))
}

// Output:
// 7
// 4
// 2
