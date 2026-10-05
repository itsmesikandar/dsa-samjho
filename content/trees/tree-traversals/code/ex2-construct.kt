class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Preorder aur inorder (values alag-alag) diye hain - tree wapas banao
fun buildTree(pre: IntArray, ino: IntArray): TreeNode? {
    val pos = HashMap<Int, Int>() // value -> inorder index (root ki jagah O(1) mein)
    ino.forEachIndexed { i, v -> pos[v] = i }
    var p = 0 // preorder mein agla root kaun
    fun make(lo: Int, hi: Int): TreeNode? { // inorder[lo..hi] wala subtree banao
        if (lo > hi) return null //@base
        val v = pre[p++] // preorder ka agla = is subtree ka ROOT //@root
        val node = TreeNode(v)
        val m = pos.getValue(v) // inorder mein root ke baayein = left subtree, daayein = right //@split
        node.left = make(lo, m - 1) // pehle left: preorder mein left subtree wale pehle aate hain
        node.right = make(m + 1, hi)
        return node
    }
    return make(0, ino.size - 1)
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
    println(serialize(buildTree(intArrayOf(3, 9, 20, 15, 7), intArrayOf(9, 3, 15, 20, 7))))
    println(serialize(buildTree(intArrayOf(-1), intArrayOf(-1))))
}

// Output:
// [3, 9, 20, null, null, 15, 7]
// [-1]
