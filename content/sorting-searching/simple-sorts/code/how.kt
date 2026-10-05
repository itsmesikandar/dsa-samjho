// Insertion sort: taash ke patton jaisa - har naya item pichhle sorted hisse mein sahi jagah baithta hai
fun insertionSort(a: IntArray) {
    for (i in 1 until a.size) {
        val key = a[i] // ise sahi jagah bithana hai //@pick
        var j = i - 1
        while (j >= 0 && a[j] > key) { // key se bade items ek-ek jagah daayein khiskao //@shift
            a[j + 1] = a[j]
            j--
        }
        a[j + 1] = key // bani hui khaali jagah mein key //@place
    }
}

fun main() {
    val a = intArrayOf(5, 2, 4, 6, 1, 3)
    insertionSort(a)
    println(a.contentToString())
    val b = intArrayOf(1, 2, 3)
    insertionSort(b) // pehle se sorted: ek bhi shift nahi, O(n)
    println(b.contentToString())
}

// Output:
// [1, 2, 3, 4, 5, 6]
// [1, 2, 3]
