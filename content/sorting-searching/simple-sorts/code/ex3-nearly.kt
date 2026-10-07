// Har item apni sorted jagah se zyada se zyada k door hai. Sort karo.
// Insertion sort: koi bhi item k se zyada jagah peeche nahi shift hoga -> O(n*k), O(n^2) nahi
fun sortNearlySorted(a: IntArray): Int {
    var shifts = 0
    for (i in 1 until a.size) {
        val key = a[i] //@pick
        var j = i - 1
        while (j >= 0 && a[j] > key) { // ye loop max k baar chalega //@shift
            a[j + 1] = a[j]
            j--
            shifts++
        }
        a[j + 1] = key //@place
    }
    return shifts
}

fun main() {
    val a = intArrayOf(6, 5, 3, 2, 8, 10, 9) // k = 3
    val shifts = sortNearlySorted(a)
    println(a.contentToString())
    println("shifts = $shifts (n*k = ${a.size * 3} se kam)")
}

// Output:
// [2, 3, 5, 6, 8, 9, 10]
// shifts = 7 (n*k = 21 se kam)
