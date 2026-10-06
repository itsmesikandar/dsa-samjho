// Saari meetings attend kar sakte ho? Start se sort - takraav hoga to sirf PADOSI meetings mein
fun canAttendAll(intervals: Array<IntArray>): Boolean {
    intervals.sortBy { it[0] } //@sort
    for (i in 1 until intervals.size) {
        if (intervals[i][0] < intervals[i - 1][1]) return false // pichhli khatam hone se pehle agli shuru //@clash
    }
    return true // 10 baje khatam, 10 baje shuru - chalega //@done
}

fun main() {
    println(canAttendAll(arrayOf(intArrayOf(13, 15), intArrayOf(9, 10), intArrayOf(10, 12))))
    println(canAttendAll(arrayOf(intArrayOf(9, 11), intArrayOf(14, 15), intArrayOf(10, 12))))
    println(canAttendAll(arrayOf()))
}

// Output:
// true
// false
// true
