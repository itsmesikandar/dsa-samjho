// 2n log, n ko city A, n ko city B. Kise A bhejein? Jinka A mein bhejna B se sabse zyada SASTA (a - b sabse chhota)
fun twoCitySchedCost(costs: Array<IntArray>): Int {
    costs.sortBy { it[0] - it[1] } // A ka "fayda" sabse zyada pehle
    val n = costs.size / 2
    var total = 0
    for (i in costs.indices) total += if (i < n) costs[i][0] else costs[i][1] // pehle n -> A, baaki -> B
    return total
}

fun main() {
    println(twoCitySchedCost(arrayOf(intArrayOf(20, 60), intArrayOf(30, 25), intArrayOf(100, 40), intArrayOf(50, 70))))
    println(twoCitySchedCost(arrayOf(intArrayOf(1, 2), intArrayOf(3, 4))))
}

// Output:
// 135
// 5
