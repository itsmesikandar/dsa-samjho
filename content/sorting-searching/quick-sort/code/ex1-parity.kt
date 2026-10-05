// Saare even numbers pehle, odd baad mein (order koi bhi). In-place.
fun sortArrayByParity(a: IntArray): IntArray {
    var s = 0 // a[0 until s] sab even
    for (i in a.indices) {
        if (a[i] % 2 == 0) { // even mila: even wale hisse ke end mein bhejo //@check
            val t = a[i] //@swap
            a[i] = a[s]
            a[s] = t
            s++
        }
    }
    return a
}

fun main() {
    println(sortArrayByParity(intArrayOf(3, 1, 2, 4)).contentToString())
    println(sortArrayByParity(intArrayOf(0)).contentToString())
}

// Output:
// [2, 4, 3, 1]
// [0]
