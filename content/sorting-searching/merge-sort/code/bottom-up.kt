// Bottom-up merge sort: recursion nahi. Pehle 1-1 size ke tukde jodo, phir 2-2, phir 4-4 ...
fun mergeSortBottomUp(a: IntArray) {
    val n = a.size
    val tmp = IntArray(n)
    var width = 1
    while (width < n) {
        var l = 0
        while (l < n - width) { // right wala tukda ho tabhi merge
            val mid = l + width - 1
            val r = minOf(l + 2 * width - 1, n - 1) // aakhri tukda chhota ho sakta hai
            merge(a, l, mid, r, tmp)
            l += 2 * width
        }
        width *= 2
    }
}

fun merge(a: IntArray, l: Int, mid: Int, r: Int, tmp: IntArray) {
    var i = l
    var j = mid + 1
    var k = l
    while (i <= mid && j <= r) tmp[k++] = if (a[i] <= a[j]) a[i++] else a[j++]
    while (i <= mid) tmp[k++] = a[i++]
    while (j <= r) tmp[k++] = a[j++]
    for (p in l..r) a[p] = tmp[p]
}

fun main() {
    val a = intArrayOf(5, 2, 6, 1, 4, 3, 7)
    mergeSortBottomUp(a)
    println(a.contentToString())
}

// Output:
// [1, 2, 3, 4, 5, 6, 7]
