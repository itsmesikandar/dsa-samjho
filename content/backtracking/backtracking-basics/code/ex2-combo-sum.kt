// Alag-alag candidates; har number kitni bhi baar le sakte ho. Jinka sum = target, wo saare combinations.
fun combinationSum(cand: IntArray, target: Int): List<List<Int>> {
    val c = cand.sorted() // sorted: koi number bacha hua target se bada to aage wale bhi bade - loop tod do
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    fun bt(start: Int, remain: Int) {
        if (remain == 0) { // target pura: ek combination mila //@found
            res.add(path.toList())
            return
        }
        for (i in start until c.size) {
            if (c[i] > remain) break // is branch ke aage sab bekaar - kaat do (pruning) //@prune
            path.add(c[i]) //@choose
            bt(i, remain - c[i]) // i se hi: same number dobara le sakte; i se pehle nahi (warna [2,3] aur [3,2] dono)
            path.removeAt(path.size - 1) //@unchoose
        }
    }
    bt(0, target)
    return res
}

fun main() {
    println(combinationSum(intArrayOf(2, 3, 6, 7), 7))
    println(combinationSum(intArrayOf(2, 3, 5), 8))
}

// Output:
// [[2, 2, 3], [7]]
// [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
