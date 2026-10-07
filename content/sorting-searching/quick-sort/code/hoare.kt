// Hoare-style partition: 2 pointers dono edges se, galat taraf wale items ka pair swap.
// Lomuto se kam swaps, aur sab barabar items par bhi beech se todta hai.
fun quickSortHoare(a: IntArray, l: Int, r: Int) {
    if (l >= r) return
    val pivot = a[(l + r) / 2]
    var i = l
    var j = r
    while (i <= j) {
        while (a[i] < pivot) i++ // left mein jo pehle se sahi taraf hain, chhodo
        while (a[j] > pivot) j--
        if (i <= j) { // dono galat taraf: swap
            val t = a[i]
            a[i] = a[j]
            a[j] = t
            i++
            j--
        }
    }
    quickSortHoare(a, l, j) // ab a[l..j] <= pivot <= a[i..r]
    quickSortHoare(a, i, r)
}

fun main() {
    val a = intArrayOf(5, 3, 8, 3, 9, 1, 3, 7)
    quickSortHoare(a, 0, a.size - 1)
    println(a.contentToString())
    val same = IntArray(6) { 4 } // sab barabar: phir bhi beech se toot-ta hai, O(n log n)
    quickSortHoare(same, 0, same.size - 1)
    println(same.contentToString())
}

// Output:
// [1, 3, 3, 3, 5, 7, 8, 9]
// [4, 4, 4, 4, 4, 4]
