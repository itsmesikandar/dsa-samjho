// Doosra structure: har item par 2 raaste - lo ya chhodo (binary decision tree)
fun subsetsBinary(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    fun go(i: Int) {
        if (i == nums.size) { // saare items ka decision ho gaya: ek poora subset
            res.add(path.toList())
            return
        }
        path.add(nums[i]) // nums[i] LO
        go(i + 1)
        path.removeAt(path.size - 1) // wapas
        go(i + 1) // nums[i] CHHODO
    }
    go(0)
    return res
}

fun main() {
    println(subsetsBinary(intArrayOf(1, 2, 3)))
}

// Output:
// [[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
