// Neeche se upar: har parent ko sift down. Leaves pehle se heap hain
fun buildHeap(a: IntArray) {
    for (i in a.size / 2 - 1 downTo 0) siftDown(a, i) // aakhri parent se root tak //@loop
}

fun siftDown(a: IntArray, start: Int) {
    var i = start
    while (true) {
        val l = 2 * i + 1
        val r = l + 1
        var m = i
        if (l < a.size && a[l] < a[m]) m = l
        if (r < a.size && a[r] < a[m]) m = r
        if (m == i) return // bachche bade ya leaf - yahin theek //@stop
        val t = a[i] // chhota bachcha upar, ye neeche //@down
        a[i] = a[m]
        a[m] = t
        i = m
    }
}

fun main() {
    val a = intArrayOf(9, 4, 7, 1, 8, 2, 3)
    buildHeap(a)
    println(a.contentToString())
    val b = intArrayOf(5, 4, 3, 2, 1)
    buildHeap(b)
    println(b.contentToString())
}

// Output:
// [1, 4, 2, 9, 8, 7, 3]
// [1, 2, 3, 5, 4]
