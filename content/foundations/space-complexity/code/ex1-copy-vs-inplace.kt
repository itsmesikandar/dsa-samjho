// Tareeka 1: nayi array mein ulta copy -> O(n) extra space
fun reversedCopy(arr: IntArray): IntArray {
    val res = IntArray(arr.size) // n naye dabbe //@alloc
    for (i in arr.indices) {
        res[i] = arr[arr.size - 1 - i] // peeche se utha ke aage rakho //@copy
    }
    return res
}

// Tareeka 2: usi array mein swap -> O(1) extra space (sirf l, r, temp)
fun reverseInPlace(arr: IntArray) {
    var l = 0
    var r = arr.size - 1
    while (l < r) {
        val temp = arr[l] //@swap
        arr[l] = arr[r]
        arr[r] = temp
        l++
        r--
    }
}

fun main() {
    val a = intArrayOf(1, 2, 3, 4)
    println(reversedCopy(a).contentToString()) // a waisa hi raha
    reverseInPlace(a) // ab a khud ulta
    println(a.contentToString())
}

// Output:
// [4, 3, 2, 1]
// [4, 3, 2, 1]
