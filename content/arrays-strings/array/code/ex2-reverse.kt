// Array ko usi jagah (in-place) ulta karo - koi nayi array nahi
fun reverse(arr: IntArray) {
    var l = 0 // left pointer: shuru se //@init
    var r = arr.size - 1 // right pointer: end se
    while (l < r) { // jab tak dono beech mein mil na jaayein //@loop
        val temp = arr[l] // swap: pehle left value ko bacha lo //@swap
        arr[l] = arr[r]
        arr[r] = temp
        l++ // dono pointer andar ki taraf //@move
        r--
    }
}

fun main() {
    val a = intArrayOf(1, 2, 3, 4, 5)
    reverse(a)
    println(a.contentToString())

    val b = intArrayOf(7, 8)
    reverse(b)
    println(b.contentToString())
}

// Output:
// [5, 4, 3, 2, 1]
// [8, 7]
