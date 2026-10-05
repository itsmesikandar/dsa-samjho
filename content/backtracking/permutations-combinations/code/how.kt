// Saare permutations (har order). used[] batata hai kaun pehle se path mein hai.
fun permute(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>()
    val used = BooleanArray(nums.size)
    fun bt() {
        if (path.size == nums.size) { // saari jagah bhar gayi: ek order poora //@found
            res.add(path.toList())
            return
        }
        for (i in nums.indices) { // har baar SHURU se - order matter karta hai (start index nahi)
            if (used[i]) continue // ye pehle se liya hua
            used[i] = true // choose //@choose
            path.add(nums[i])
            bt()
            path.removeAt(path.size - 1) // un-choose: agle option ke liye wapas khaali //@unchoose
            used[i] = false
        }
    }
    bt()
    return res
}

fun main() {
    println(permute(intArrayOf(1, 2, 3)))
    println(permute(intArrayOf(0, 1)))
}

// Output:
// [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
// [[0, 1], [1, 0]]
