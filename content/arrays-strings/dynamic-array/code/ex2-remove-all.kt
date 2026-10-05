// List se saare x hatao, O(n) mein: rakhne layak items ko aage "likhte" jao
fun removeAllX(list: MutableList<Int>, x: Int) {
    var w = 0 // agla item kahan likhna hai //@init
    for (r in list.indices) { // r: padhne wala pointer
        if (list[r] != x) { // ye rakhna hai? //@check
            list[w] = list[r] // haan: aage likh do //@keep
            w++
        }
    }
    while (list.size > w) list.removeAt(list.size - 1) // bacha hua end se hatao (har ek O(1)) //@trim
}

fun main() {
    val list = mutableListOf(3, 2, 2, 3, 4, 2)
    removeAllX(list, 2)
    println(list)
    // Library wala tareeka bhi O(n) hai:
    val other = mutableListOf(3, 2, 2, 3, 4, 2)
    other.removeAll { it == 2 }
    println(other)
}

// Output:
// [3, 3, 4]
// [3, 3, 4]
