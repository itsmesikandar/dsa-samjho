// Quick sort: pivot choose karo, chhote left / bade right (partition), phir dono taraf recursion
fun quickSort(a: IntArray, l: Int, r: Int) {
    if (l >= r) return // 0 ya 1 item //@base
    val p = partition(a, l, r)
    quickSort(a, l, p - 1) // pivot apni pakki jagah par - use chhod ke dono taraf
    quickSort(a, p + 1, r)
}

// Lomuto partition. Pivot = beech wala item (sorted input par bhi theek), use end par rakh ke kaam
fun partition(a: IntArray, l: Int, r: Int): Int {
    swap(a, (l + r) / 2, r) //@pivot
    val pivot = a[r]
    var s = l // a[l until s] sab pivot se chhote
    for (i in l until r) {
        if (a[i] < pivot) { // chhota mila: chhoton wale hisse mein daalo //@check
            swap(a, i, s) //@swap
            s++
        }
    }
    swap(a, s, r) // pivot chhoton ke theek baad - yahi uski pakki jagah //@place
    return s
}

fun swap(a: IntArray, i: Int, j: Int) {
    val t = a[i]
    a[i] = a[j]
    a[j] = t
}

fun main() {
    val a = intArrayOf(10, 80, 30, 90, 40, 50, 70)
    quickSort(a, 0, a.size - 1)
    println(a.contentToString())
}

// Output:
// [10, 30, 40, 50, 70, 80, 90]
