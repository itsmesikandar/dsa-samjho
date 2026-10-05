// Solution likhne ke baad hamesha edge cases se test karo
fun average(arr: IntArray): Double? {
    if (arr.isEmpty()) return null // edge case 1: khaali input
    var sum = 0L // edge case 2: bada sum -> Long, warna overflow
    for (x in arr) sum += x
    return sum.toDouble() / arr.size
}

fun main() {
    println(average(intArrayOf(2, 4, 9))) // normal case
    println(average(intArrayOf())) // khaali array
    println(average(intArrayOf(Int.MAX_VALUE, Int.MAX_VALUE))) // bade numbers
    println(average(intArrayOf(-3))) // ek hi item, negative
}

// Output:
// 5.0
// null
// 2.147483647E9
// -3.0
