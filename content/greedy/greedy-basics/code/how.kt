// Budget mein zyada se zyada cheezein: har baar sabse SASTI lo (greedy)
fun maxItems(costs: IntArray, budget: Int): Int {
    val sorted = costs.sorted() // sasti pehle //@sort
    var left = budget
    var count = 0
    for (c in sorted) {
        if (c > left) break // ye nahi le sakte - aage wali isse bhi mehngi //@stop
        left -= c // abhi ki sabse sasti lo //@take
        count++
    }
    return count //@done
}

fun main() {
    println(maxItems(intArrayOf(6, 2, 9, 3, 1, 4), 10))
    println(maxItems(intArrayOf(10, 20), 5))
    println(maxItems(intArrayOf(2, 2, 2), 6))
}

// Output:
// 4
// 0
// 3
