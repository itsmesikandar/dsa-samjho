// Min-heap check: har parent apne bachchon se chhota ya barabar
fun isMinHeap(a: IntArray): Boolean {
    for (i in 0 until a.size / 2) { // sirf parents; index n/2 se aage sab leaves //@loop
        val l = 2 * i + 1
        val r = l + 1
        if (a[l] < a[i] || (r < a.size && a[r] < a[i])) return false // bachcha parent se chhota - toota //@check
    }
    return true // koi parent bada nahi mila //@ok
}

fun main() {
    println(isMinHeap(intArrayOf(3, 5, 4, 9, 6, 8, 1)))
    println(isMinHeap(intArrayOf(1, 2, 3, 4, 5)))
    println(isMinHeap(intArrayOf(1, 5, 2, 6, 7, 3)))
    println(isMinHeap(intArrayOf(7)))
}

// Output:
// false
// true
// true
// true
