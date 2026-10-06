// DSU: har group ka ek leader (root). find = leader kaun? union = do groups jodo
class DSU(n: Int) {
    val parent = IntArray(n) { it } // shuru mein har koi khud apna leader
    val size = IntArray(n) { 1 }

    fun find(x: Int): Int {
        if (parent[x] != x) parent[x] = find(parent[x]) // path compression: seedha leader se jod do //@find
        return parent[x]
    }

    fun union(a: Int, b: Int): Boolean {
        var ra = find(a) //@roots
        var rb = find(b)
        if (ra == rb) return false // pehle se ek hi group //@same
        if (size[ra] < size[rb]) { // bada group leader rahe - ped chhota (kam gehra) rehta hai
            val t = ra
            ra = rb
            rb = t
        }
        parent[rb] = ra // chhote group ka leader bade ke leader ke neeche //@link
        size[ra] += size[rb]
        return true
    }
}

fun main() {
    val d = DSU(8)
    val pairs = arrayOf(
        intArrayOf(0, 1), intArrayOf(2, 3), intArrayOf(0, 2), intArrayOf(4, 5),
        intArrayOf(3, 4), intArrayOf(1, 3), intArrayOf(6, 7),
    )
    for ((a, b) in pairs) d.union(a, b)
    println(d.parent.contentToString())
    println("groups: ${(0 until 8).count { d.find(it) == it }}, 3 aur 5 saath? ${d.find(3) == d.find(5)}")
}

// Output:
// [0, 0, 0, 0, 0, 4, 6, 6]
// groups: 2, 3 aur 5 saath? true
