fun findMax(arr: IntArray): Int {
    require(arr.isNotEmpty()) { "Khaali array ka max nahi hota" }
    var max = arr[0] // pehla number hi abhi tak ka sabse bada //@init
    for (i in 1 until arr.size) { // baaki sab ko ek-ek karke dekho
        if (arr[i] > max) { // naya champion mila? //@compare
            max = arr[i] //@update
        }
    }
    return max //@done
}

fun main() {
    println(findMax(intArrayOf(3, 8, 2, 9, 4)))
    println(findMax(intArrayOf(-5, -2, -9))) // sab negative: max = 0 se shuru karte to galat aata
}

// Output:
// 9
// -2
