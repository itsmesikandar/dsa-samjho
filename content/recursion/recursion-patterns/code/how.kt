// Divide & conquer: array ko aadha karo, dono halves ka max lo, bada wala jeeta
fun findMax(a: IntArray, l: Int, r: Int): Int {
    if (l == r) return a[l] // ek hi item: wahi max //@base
    val mid = (l + r) / 2 // beech se todo //@split
    val left = findMax(a, l, mid) // left half ka max (bharosa)
    val right = findMax(a, mid + 1, r) // right half ka max
    return maxOf(left, right) // do jawab jodo //@combine
}

fun main() {
    val a = intArrayOf(3, 9, 2, 7, 5)
    println(findMax(a, 0, a.size - 1))
    println(findMax(intArrayOf(-4), 0, 0))
}

// Output:
// 9
// -4
