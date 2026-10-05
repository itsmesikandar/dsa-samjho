class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// Har level ka average - level order + har level ka hisaab
fun averageOfLevels(root: TreeNode?): List<Double> {
    val res = mutableListOf<Double>()
    if (root == null) return res
    val q = ArrayDeque<TreeNode>()
    q.addLast(root)
    while (q.isNotEmpty()) {
        val size = q.size
        var sum = 0L // Long: bade values ka jod Int se bahar ja sakta hai
        repeat(size) {
            val n = q.removeFirst()
            sum += n.value
            n.left?.let { q.addLast(it) }
            n.right?.let { q.addLast(it) }
        }
        res.add(sum.toDouble() / size)
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
    println(averageOfLevels(build(3, 9, 20, null, null, 15, 7)))
}

// Output:
// [3.0, 14.5, 11.0]
