// Kitne jode (i < j) hain jahan nums[i] > 2 * nums[j]?
fun reversePairs(nums: IntArray): Int = sortCount(nums.copyOf(), 0, nums.size - 1, IntArray(nums.size))

fun sortCount(a: IntArray, l: Int, r: Int, tmp: IntArray): Int {
    if (l >= r) return 0 //@base
    val mid = (l + r) / 2
    var count = sortCount(a, l, mid, tmp) + sortCount(a, mid + 1, r, tmp) //@halves
    // MERGE SE PEHLE alag ginti: dono halves sorted hain, to j kabhi peeche nahi jaata
    var j = mid + 1
    for (i in l..mid) {
        while (j <= r && a[i].toLong() > 2L * a[j]) j++ // Long: 2 * a[j] Int mein overflow ho sakta hai //@count
        count += j - (mid + 1) // right ke a[mid+1 .. j-1] sab a[i] ke saath jode banate hain //@add
    }
    // ab normal merge
    var i = l
    var k = l
    j = mid + 1
    while (i <= mid && j <= r) tmp[k++] = if (a[i] <= a[j]) a[i++] else a[j++] //@merge
    while (i <= mid) tmp[k++] = a[i++]
    while (j <= r) tmp[k++] = a[j++]
    for (p in l..r) a[p] = tmp[p]
    return count
}

fun main() {
    println(reversePairs(intArrayOf(2, 4, 3, 5, 1)))
    println(reversePairs(intArrayOf(1, 3, 2, 3, 1)))
    println(reversePairs(intArrayOf(1, 1073741824))) // 2 * 1073741824 Int mein overflow: Long zaroori
}

// Output:
// 3
// 2
// 0
