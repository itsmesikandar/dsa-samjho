class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Teeno DFS orders - farak sirf ek line ki jagah ka: node ko KAB likhte ho
fun preorder(r: TreeNode?, out: MutableList<Int>) {
    if (r == null) return
    out.add(r.value) // pehle node
    preorder(r.left, out)
    preorder(r.right, out)
}

fun inorder(r: TreeNode?, out: MutableList<Int>) {
    if (r == null) return
    inorder(r.left, out)
    out.add(r.value) // beech mein node
    inorder(r.right, out)
}

fun postorder(r: TreeNode?, out: MutableList<Int>) {
    if (r == null) return
    postorder(r.left, out)
    postorder(r.right, out)
    out.add(r.value) // aakhir mein node
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
    val t = build(1, 2, 3, 4, 5)
    println("pre:  " + mutableListOf<Int>().also { preorder(t, it) })
    println("in:   " + mutableListOf<Int>().also { inorder(t, it) })
    println("post: " + mutableListOf<Int>().also { postorder(t, it) })
}

// Output:
// pre:  [1, 2, 4, 5, 3]
// in:   [4, 2, 5, 1, 3]
// post: [4, 5, 2, 3, 1]
