fun tryChange(num: Int, arr: IntArray) {
    var x = num // num ki local copy (Kotlin mein parameter khud val hota hai) //@local
    x = 100 // sirf is frame ka local dabba badla //@x
    arr[0] = 100 // heap wala ASLI array badla //@arr
}

fun main() {
    val num = 5
    val arr = intArrayOf(5, 6)
    tryChange(num, arr) // num ki value aur arr ka address copy hokar gaye //@call
    println(num) // 5 hi rahega //@print
    println(arr.contentToString()) // [100, 6]
}

// Output:
// 5
// [100, 6]
