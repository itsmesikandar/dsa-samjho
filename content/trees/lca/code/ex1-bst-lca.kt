class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// BST: dono ek taraf hain to wahin jao; alag taraf hue to yahi LCA
fun lcaBst(root: TreeNode?, p: Int, q: Int): TreeNode? {
    var cur = root
    while (cur != null) {
        if (p < cur.value && q < cur.value) cur = cur.left // dono chhote - LCA left mein //@left
        else if (p > cur.value && q > cur.value) cur = cur.right // dono bade - right mein //@right
        else return cur // alag taraf (ya ek yahi hai) - split point //@split
    }
    return null
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
    val root = build(6, 2, 8, 0, 4, 7, 9, null, null, 3, 5)
    println(lcaBst(root, 3, 5)?.value)
    println(lcaBst(root, 2, 8)?.value)
}

// Output:
// 4
// 6
