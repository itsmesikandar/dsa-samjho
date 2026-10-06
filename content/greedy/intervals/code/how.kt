// Merge intervals: start se sort, phir ek pass - har interval ya to pichhle mein ghul jaata hai ya naya shuru
fun merge(intervals: Array<IntArray>): List<List<Int>> {
    intervals.sortBy { it[0] } // start se sort - takraane wale paas paas aa jaate hain //@sort
    val out = mutableListOf<IntArray>()
    for (cur in intervals) {
        val last = out.lastOrNull()
        if (last == null || cur[0] > last[1]) {
            out.add(intArrayOf(cur[0], cur[1])) // pichhle ke khatam hone ke baad shuru - naya interval //@new
        } else {
            last[1] = maxOf(last[1], cur[1]) // takraaya - pichhle ko aage tak khiincho //@extend
        }
    }
    return out.map { it.toList() } //@done
}

fun main() {
    val a = arrayOf(intArrayOf(6, 8), intArrayOf(1, 3), intArrayOf(2, 4), intArrayOf(9, 10), intArrayOf(8, 9), intArrayOf(11, 12))
    println(merge(a))
    println(merge(arrayOf(intArrayOf(1, 10), intArrayOf(2, 3), intArrayOf(4, 5))))
}

// Output:
// [[1, 4], [6, 10], [11, 12]]
// [[1, 10]]
