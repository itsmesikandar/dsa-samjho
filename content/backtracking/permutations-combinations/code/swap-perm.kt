// Permutations bina used[] aur bina path ke: array ke andar hi swap karke
fun permuteSwap(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    val a = nums.copyOf()
    fun swap(i: Int, j: Int) {
        val t = a[i]
        a[i] = a[j]
        a[j] = t
    }
    fun go(k: Int) { // position k par kaun baithega? k..n-1 mein se har ek ko yahan laake try karo
        if (k == a.size) {
            res.add(a.toList())
            return
        }
        for (i in k until a.size) {
            swap(k, i) // i wala k par aaya
            go(k + 1)
            swap(k, i) // wapas jaisa tha (backtrack)
        }
    }
    go(0)
    return res
}

fun main() {
    println(permuteSwap(intArrayOf(1, 2, 3)))
}

// Output:
// [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 2, 1], [3, 1, 2]]
