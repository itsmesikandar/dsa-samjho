class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Tree ko PREORDER order mein ek seedhi chain banao: sab right se jude, left null. In-place, O(1) extra.
fun flatten(root: TreeNode?) {
    var cur = root
    while (cur != null) {
        val l = cur.left
        if (l != null) { // left subtree ko cur aur cur.right ke BEECH ghusao //@hasLeft
            var tail: TreeNode = l
            while (true) tail = tail.right ?: break // left subtree ka preorder mein aakhri = sabse daayein //@tail
            tail.right = cur.right // purana right subtree uske baad
            cur.right = l // left ab right ki jagah //@move
            cur.left = null
        }
        cur = cur.right // agla node (preorder ka agla) //@next
    }
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

fun chain(root: TreeNode?): List<Int> { // right pointers par chalo
    val out = mutableListOf<Int>()
    var c = root
    while (c != null) {
        out.add(c.value)
        c = c.right
    }
    return out
}

fun main() {
    val t = build(1, 2, 5, 3, 4, null, 6)
    flatten(t)
    println(chain(t))
    val one = build(0)
    flatten(one)
    println(chain(one))
}

// Output:
// [1, 2, 3, 4, 5, 6]
// [0]
