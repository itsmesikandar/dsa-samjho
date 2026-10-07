// Sorted, bina collision wali list mein naya interval: 3 hisse - pehle wale, collide hone wale (milao), baad wale
fun insert(intervals: Array<IntArray>, newInterval: IntArray): List<List<Int>> {
    val out = mutableListOf<List<Int>>()
    var s = newInterval[0]
    var e = newInterval[1]
    var i = 0
    val n = intervals.size
    while (i < n && intervals[i][1] < s) out.add(intervals[i++].toList()) // naye se pehle khatam - jaise hai
    while (i < n && intervals[i][0] <= e) { // naye se collide karta hai - milao
        s = minOf(s, intervals[i][0])
        e = maxOf(e, intervals[i][1])
        i++
    }
    out.add(listOf(s, e))
    while (i < n) out.add(intervals[i++].toList()) // baad wale - jaise hai
    return out
}

fun main() {
    val a = arrayOf(intArrayOf(1, 2), intArrayOf(4, 6), intArrayOf(8, 10), intArrayOf(12, 13))
    println(insert(a, intArrayOf(5, 9)))
    println(insert(arrayOf(), intArrayOf(3, 4)))
}

// Output:
// [[1, 2], [4, 10], [12, 13]]
// [[3, 4]]
