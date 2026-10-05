// Line height ke badhte order mein honi chahiye. Kitne students galat jagah khade hain?
fun heightChecker(heights: IntArray): Int {
    val expected = heights.copyOf() // asli line mat chhedo, copy ko sort karo
    for (i in 0 until expected.size - 1) { // selection sort
        var min = i
        for (j in i + 1 until expected.size) if (expected[j] < expected[min]) min = j //@find
        val t = expected[i] // sabse chhota aage //@swap
        expected[i] = expected[min]
        expected[min] = t
    }
    var count = 0
    for (i in heights.indices) if (heights[i] != expected[i]) count++ // jagah alag? //@compare
    return count
}

fun main() {
    println(heightChecker(intArrayOf(1, 1, 4, 2, 1, 3)))
    println(heightChecker(intArrayOf(1, 2, 3, 4, 5)))
}

// Output:
// 3
// 0
