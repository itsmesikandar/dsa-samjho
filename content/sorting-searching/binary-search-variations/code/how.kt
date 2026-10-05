// Pehla index jahan a[i] >= x (sab chhote hon to a.size). "Pehla TRUE" wala template.
fun lowerBound(a: IntArray, x: Int): Int {
    var lo = 0
    var hi = a.size // answer [lo, hi] mein; hi = size matlab 'koi nahi mila' //@init
    while (lo < hi) { // lo == hi = ek hi candidate bacha = wahi answer
        val mid = lo + (hi - lo) / 2 //@mid
        if (a[mid] >= x) hi = mid // mid khud answer ho sakta hai - use range mein rakho //@yes
        else lo = mid + 1 // mid aur uske left sab chhote - hatao //@no
    }
    return lo //@done
}

fun main() {
    val a = intArrayOf(1, 2, 4, 4, 4, 7, 9)
    println(lowerBound(a, 4))
    println(lowerBound(a, 5))
    println(lowerBound(a, 10))
}

// Output:
// 2
// 5
// 7
