// In-place heap sort: pehle max-heap, phir root (sabse bada) ko end par bhejte jao
fun heapSort(a: IntArray) {
    val n = a.size
    for (i in n / 2 - 1 downTo 0) siftDown(a, i, n) // O(n) mein max-heap //@build
    for (end in n - 1 downTo 1) {
        swap(a, 0, end) // sabse bada apni pakki jagah (end) par //@swap
        siftDown(a, 0, end) // heap ab sirf 0 until end; naya root theek karo //@fix
    }
}

fun siftDown(a: IntArray, start: Int, n: Int) {
    var i = start
    while (true) {
        val l = 2 * i + 1
        val r = l + 1
        var m = i
        if (l < n && a[l] > a[m]) m = l // max-heap: bada bachcha upar aayega
        if (r < n && a[r] > a[m]) m = r
        if (m == i) return
        swap(a, i, m) //@down
        i = m
    }
}

fun swap(a: IntArray, i: Int, j: Int) {
    val t = a[i]
    a[i] = a[j]
    a[j] = t
}

fun main() {
    val a = intArrayOf(5, 2, 9, 1, 6, 3)
    heapSort(a)
    println(a.contentToString())
    val b = intArrayOf(3, 1, 2, 3, 1)
    heapSort(b)
    println(b.contentToString())
}

// Output:
// [1, 2, 3, 5, 6, 9]
// [1, 1, 2, 3, 3]
