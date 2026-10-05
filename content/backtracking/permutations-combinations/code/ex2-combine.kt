// 1..n mein se k numbers ke saare combinations (order matter nahi karta)
fun combine(n: Int, k: Int): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    fun bt(start: Int) {
        if (path.size == k) { //@found
            res.add(path.toList())
            return
        }
        val need = k - path.size // abhi kitne aur chahiye
        for (i in start..n - need + 1) { // isse bade se shuru kiya to aage kaafi numbers hi nahi bachenge (pruning) //@prune
            path.add(i) //@choose
            bt(i + 1) // sirf aage ke numbers: [1, 2] bana to [2, 1] kabhi nahi
            path.removeAt(path.size - 1) //@unchoose
        }
    }
    bt(1)
    return res
}

fun main() {
    println(combine(4, 2))
    println(combine(1, 1))
}

// Output:
// [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
// [[1]]
