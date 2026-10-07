// Merge sort: aadha karo, dono halves ko sort karo (recursion), phir 2 sorted halves ko jodo (merge)
fun mergeSort(a: IntArray, l: Int, r: Int, tmp: IntArray) {
    if (l >= r) return // 0 ya 1 item: pehle se sorted //@base
    val mid = (l + r) / 2 //@split
    mergeSort(a, l, mid, tmp)
    mergeSort(a, mid + 1, r, tmp)
    merge(a, l, mid, r, tmp)
}

// a[l..mid] aur a[mid+1..r] dono sorted hain -> inhe ek sorted hissa banao
fun merge(a: IntArray, l: Int, mid: Int, r: Int, tmp: IntArray) {
    var i = l
    var j = mid + 1
    var k = l
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++] // dono ke aage wale mein chhota lo; barabar par left = stable //@pick
        else tmp[k++] = a[j++]
    }
    while (i <= mid) tmp[k++] = a[i++] // ek half khatam: doosre ke bache seedhe copy //@rest
    while (j <= r) tmp[k++] = a[j++]
    for (p in l..r) a[p] = tmp[p] // tmp se wapas a mein //@copy
}

fun main() {
    val a = intArrayOf(38, 27, 43, 3, 9, 82, 10)
    mergeSort(a, 0, a.size - 1, IntArray(a.size))
    println(a.contentToString())
}

// Output:
// [3, 9, 10, 27, 38, 43, 82]
