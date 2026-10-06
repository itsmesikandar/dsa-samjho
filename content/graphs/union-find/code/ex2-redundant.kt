// Edges ek ek jodo. Jis edge ke dono sire PEHLE SE ek group mein - wahi cycle banati hai
fun find(parent: IntArray, x: Int): Int {
    if (parent[x] != x) parent[x] = find(parent, parent[x])
    return parent[x]
}

fun findRedundantConnection(edges: Array<IntArray>): IntArray {
    val parent = IntArray(edges.size + 1) { it } // nodes 1..n, aur n = edges.size
    for ((a, b) in edges) {
        val ra = find(parent, a) //@roots
        val rb = find(parent, b)
        if (ra == rb) return intArrayOf(a, b) // a se b pehle hi pahunch sakte the - ye edge faltu //@cycle
        parent[rb] = ra //@merge
    }
    return intArrayOf()
}

fun main() {
    val edges = arrayOf(intArrayOf(1, 2), intArrayOf(1, 3), intArrayOf(2, 4), intArrayOf(3, 4), intArrayOf(4, 5))
    println(findRedundantConnection(edges).contentToString())
    println(findRedundantConnection(arrayOf(intArrayOf(1, 2), intArrayOf(2, 3), intArrayOf(3, 1))).contentToString())
}

// Output:
// [3, 4]
// [3, 1]
