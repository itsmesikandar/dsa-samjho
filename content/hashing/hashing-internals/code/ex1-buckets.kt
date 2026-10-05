// Har bucket mein kitni keys giri? (index = key % m)
fun bucketCounts(keys: IntArray, m: Int): IntArray {
    val counts = IntArray(m)
    for (k in keys) {
        counts[Math.floorMod(k, m)]++ // is key ka bucket //@put
    }
    return counts //@done
}

fun main() {
    val counts = bucketCounts(intArrayOf(12, 7, 19, 25, 30), 7)
    println(counts.contentToString())
    // collisions = har bucket mein pehle ke baad wali keys
    println(counts.sumOf { maxOf(0, it - 1) })
}

// Output:
// [1, 0, 1, 0, 1, 2, 0]
// 1
