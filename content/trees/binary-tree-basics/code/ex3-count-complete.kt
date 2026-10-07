class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Complete tree (har level bhara, aakhri level left se bhara) ke nodes O(n) se tez count karo
fun countNodes(root: TreeNode?): Int {
    if (root == null) return 0 //@base
    var lh = 0
    var n: TreeNode? = root
    while (n != null) { // sabse left raasta ki length
        lh++
        n = n.left
    }
    var rh = 0
    n = root
    while (n != null) { // sabse right raasta ki length
        rh++
        n = n.right
    }
    if (lh == rh) return (1 shl lh) - 1 // dono barabar = perfect tree: 2^h - 1, neeche jaana hi nahi //@perfect
    return 1 + countNodes(root.left) + countNodes(root.right) // warna dono taraf (ek taraf pakka perfect hoga) //@split
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
    println(countNodes(build(1, 2, 3, 4, 5, 6)))
    println(countNodes(build(1, 2, 3, 4, 5, 6, 7)))
    println(countNodes(build()))
}

// Output:
// 6
// 7
// 0
