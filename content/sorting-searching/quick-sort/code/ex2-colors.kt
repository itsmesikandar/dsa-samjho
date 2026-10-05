// Sirf 0, 1, 2 hain. Ek hi pass mein sort karo (in-place): 0 aage, 1 beech, 2 peeche.
fun sortColors(a: IntArray) {
    var low = 0 // a[0 until low] = sab 0
    var mid = 0 // a[low until mid] = sab 1; a[mid..high] abhi dekhe nahi
    var high = a.size - 1 // a[high+1 ..] = sab 2
    while (mid <= high) {
        when (a[mid]) {
            0 -> { // 0 ko aage wale hisse mein bhejo //@zero
                swap(a, low, mid)
                low++
                mid++
            }
            1 -> mid++ // 1 pehle se sahi hisse mein //@one
            else -> { // 2 ko peeche bhejo; mid mat badhao - wahan se aaya item abhi dekha nahi //@two
                swap(a, mid, high)
                high--
            }
        }
    }
}

fun swap(a: IntArray, i: Int, j: Int) {
    val t = a[i]
    a[i] = a[j]
    a[j] = t
}

fun main() {
    val a = intArrayOf(2, 0, 2, 1, 1, 0)
    sortColors(a)
    println(a.contentToString())
}

// Output:
// [0, 0, 1, 1, 2, 2]
