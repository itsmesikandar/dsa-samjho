// arr ke [from..to] hisse ko ulta karo (wahi two-pointer swap)
fun reverse(arr: IntArray, from: Int, to: Int) {
    var l = from
    var r = to
    while (l < r) {
        val t = arr[l] //@swap
        arr[l] = arr[r]
        arr[r] = t
        l++
        r--
    }
}

// Har item ko k jagah right khisakao; jo end se bahar gire wo shuru mein aaye
fun rotateRight(arr: IntArray, k: Int) {
    val n = arr.size
    if (n == 0) return
    val steps = k % n // n steps ghumao to array wapas wahi; isliye k % n kaafi //@mod
    reverse(arr, 0, n - 1) // 1) poora array ulta //@all
    reverse(arr, 0, steps - 1) // 2) pehle 'steps' items ulte //@left
    reverse(arr, steps, n - 1) // 3) baaki items ulte //@right
}

fun main() {
    val a = intArrayOf(1, 2, 3, 4, 5, 6, 7)
    rotateRight(a, 3)
    println(a.contentToString())

    val b = intArrayOf(1, 2)
    rotateRight(b, 5) // k > n: 5 % 2 = 1 step
    println(b.contentToString())
}

// Output:
// [5, 6, 7, 1, 2, 3, 4]
// [2, 1]
