// Sorted array mein target ka index; na mile to -1
fun binarySearch(a: IntArray, target: Int): Int {
    var lo = 0
    var hi = a.size - 1 // [lo, hi] = jahan answer ho sakta hai //@init
    while (lo <= hi) { // range khaali nahi hui
        val mid = lo + (hi - lo) / 2 // (lo + hi) / 2 bade index par overflow kar sakta hai //@mid
        when {
            a[mid] == target -> return mid //@found
            a[mid] < target -> lo = mid + 1 // target right mein: mid including left aadha bekaar //@right
            else -> hi = mid - 1 // target left mein //@left
        }
    }
    return -1 // range khaali: target hai hi nahi //@none
}

fun main() {
    val a = intArrayOf(-1, 0, 3, 5, 9, 12)
    println(binarySearch(a, 9))
    println(binarySearch(a, 2))
}

// Output:
// 4
// -1
