// Saare subsets (power set). Backtracking: choose -> explore -> un-choose
fun subsets(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    val path = mutableListOf<Int>() // abhi tak chune hue items
    fun bt(start: Int) {
        res.add(path.toList()) // har node khud ek subset hai - COPY daalo (path aage badlega) //@add
        for (i in start until nums.size) {
            path.add(nums[i]) // choose //@choose
            bt(i + 1) // explore: sirf aage ke items (peeche wale lene se same subset dobara banega)
            path.removeAt(path.size - 1) // un-choose: wapas pehle jaisi halat //@unchoose
        }
    }
    bt(0)
    return res
}

fun main() {
    println(subsets(intArrayOf(1, 2, 3)))
    println(subsets(intArrayOf(0)))
}

// Output:
// [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
// [[], [0]]
