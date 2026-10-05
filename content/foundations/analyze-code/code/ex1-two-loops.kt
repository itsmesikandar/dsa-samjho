// Do alag arrays ka total sum: ek loop ke BAAD doosra loop
fun sumBoth(a: IntArray, b: IntArray): Int {
    var s = 0
    for (x in a) s += x // n baar //@loopA
    for (y in b) s += y // m baar //@loopB
    return s // total n + m //@done
}

fun main() {
    println(sumBoth(intArrayOf(1, 2, 3), intArrayOf(4, 5)))
    println(sumBoth(IntArray(1000) { 1 }, IntArray(10) { 1 })) // 1000 + 10 kaam
}

// Output:
// 15
// 1010
