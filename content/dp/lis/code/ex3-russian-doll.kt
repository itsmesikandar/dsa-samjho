// Lifafa andar tabhi jaata jab width aur height DONO chhote. Width se sort (same width par height ULTI), phir heights par LIS
fun maxEnvelopes(envelopes: Array<IntArray>): Int {
    envelopes.sortWith(compareBy<IntArray> { it[0] }.thenByDescending { it[1] }) // same width - bada pehle, taaki dono ek chain mein na aayen //@sort
    val tails = IntArray(envelopes.size)
    var size = 0
    for (e in envelopes) {
        val h = e[1]
        var lo = 0
        var hi = size
        while (lo < hi) {
            val mid = (lo + hi) / 2
            if (tails[mid] < h) lo = mid + 1 else hi = mid
        }
        tails[lo] = h // heights par O(n log n) LIS //@place
        if (lo == size) size++
    }
    return size //@done
}

fun main() {
    val env = arrayOf(intArrayOf(3, 4), intArrayOf(5, 6), intArrayOf(5, 5), intArrayOf(5, 7), intArrayOf(2, 2), intArrayOf(6, 8))
    println(maxEnvelopes(env))
    println(maxEnvelopes(arrayOf(intArrayOf(1, 1), intArrayOf(1, 1))))
}

// Output:
// 4
// 1
