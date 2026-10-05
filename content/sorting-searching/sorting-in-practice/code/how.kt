// Counting sort: values chhoti range (0..maxVal) mein hon to compare kiye bina sort - O(n + k)
fun countingSort(a: IntArray, maxVal: Int) {
    val count = IntArray(maxVal + 1)
    for (x in a) count[x]++ // har value kitni baar aayi //@count
    var i = 0
    for (v in 0..maxVal) { // chhoti value se shuru, jitni baar aayi utni baar likho
        repeat(count[v]) { a[i++] = v } //@write
    }
}

fun main() {
    val a = intArrayOf(4, 2, 2, 8, 3, 3, 1)
    countingSort(a, 8)
    println(a.contentToString())
}

// Output:
// [1, 2, 2, 3, 3, 4, 8]
