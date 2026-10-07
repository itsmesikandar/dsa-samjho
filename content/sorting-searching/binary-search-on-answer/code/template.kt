// "Sabse chhota x jo chal jaaye" - condition: feasible(x) monotonic ho (x chala to x+1 bhi chalega)
fun minFeasible(lo0: Int, hi0: Int, feasible: (Int) -> Boolean): Int {
    var lo = lo0
    var hi = hi0 // hi0 pakka feasible hona chahiye
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2
        if (feasible(mid)) hi = mid else lo = mid + 1
    }
    return lo
}

fun main() {
    // sabse chhota x jiska x * x * x >= 1000
    println(minFeasible(0, 1000) { it.toLong() * it * it >= 1000 })
    // 12 chapters, 5 din: roz kam se kam kitne chapter padho?
    println(minFeasible(1, 12) { perDay -> (12 - 1) / perDay + 1 <= 5 })
}

// Output:
// 10
// 3
