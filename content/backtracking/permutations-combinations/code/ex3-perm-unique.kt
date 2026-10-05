// Input mein duplicates ho sakte hain. Saare ALAG permutations (koi dobara nahi).
fun permuteUnique(nums: IntArray): List<List<Int>> {
    val a = nums.sorted() // same values paas-paas aa jaayein
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    val used = BooleanArray(a.size)
    fun bt() {
        if (path.size == a.size) { //@found
            res.add(path.toList())
            return
        }
        for (i in a.indices) {
            if (used[i]) continue
            // same value ka PICHHLA copy is level par abhi khaali hai (wapas aa chuka) -> ye raasta pehle ho chuka
            if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue //@skip
            used[i] = true //@choose
            path.add(a[i])
            bt()
            path.removeAt(path.size - 1) //@unchoose
            used[i] = false
        }
    }
    bt()
    return res
}

fun main() {
    println(permuteUnique(intArrayOf(1, 1, 2)))
    println(permuteUnique(intArrayOf(2, 2, 2)))
}

// Output:
// [[1, 1, 2], [1, 2, 1], [2, 1, 1]]
// [[2, 2, 2]]
