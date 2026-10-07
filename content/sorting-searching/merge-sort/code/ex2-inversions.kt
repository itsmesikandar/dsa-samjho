// Inversions count karo: i < j aur a[i] > a[j]. Merge sort ke merge mein O(n log n)
fun countInversions(arr: IntArray): Long = sortCount(arr.copyOf(), 0, arr.size - 1, IntArray(arr.size))

fun sortCount(a: IntArray, l: Int, r: Int, tmp: IntArray): Long {
    if (l >= r) return 0 //@base
    val mid = (l + r) / 2
    var count = sortCount(a, l, mid, tmp) + sortCount(a, mid + 1, r, tmp) // dono halves ke andar wale //@halves
    var i = l
    var j = mid + 1
    var k = l
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) {
            tmp[k++] = a[i++] //@left
        } else {
            count += mid - i + 1 // a[j] left ke BACHE HUE saare items se chhota hai //@cross
            tmp[k++] = a[j++]
        }
    }
    while (i <= mid) tmp[k++] = a[i++]
    while (j <= r) tmp[k++] = a[j++]
    for (p in l..r) a[p] = tmp[p]
    return count
}

fun main() {
    println(countInversions(intArrayOf(2, 4, 1, 3, 5)))
    println(countInversions(intArrayOf(5, 4, 3, 2, 1)))
}

// Output:
// 3
// 10
