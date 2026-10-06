// Kam se kam hatao = zyada se zyada rakho. Jo JALDI khatam ho use rakho - baaki ke liye sabse zyada jagah bachti hai
fun eraseOverlapIntervals(intervals: Array<IntArray>): Int {
    intervals.sortBy { it[1] } // end se sort (start se nahi!) //@sort
    var end = Int.MIN_VALUE // aakhri rakhe interval ka end
    var removed = 0
    for (iv in intervals) {
        if (iv[0] >= end) {
            end = iv[1] // takraata nahi - rakho //@keep
        } else {
            removed++ // takraata hai - isi ko hatao (iska end pichhle se bada ya barabar) //@drop
        }
    }
    return removed //@done
}

fun main() {
    println(eraseOverlapIntervals(arrayOf(intArrayOf(1, 4), intArrayOf(2, 3), intArrayOf(3, 6), intArrayOf(5, 7), intArrayOf(6, 8))))
    println(eraseOverlapIntervals(arrayOf(intArrayOf(1, 2), intArrayOf(1, 2), intArrayOf(1, 2))))
    println(eraseOverlapIntervals(arrayOf(intArrayOf(1, 2), intArrayOf(2, 3))))
}

// Output:
// 2
// 2
// 0
