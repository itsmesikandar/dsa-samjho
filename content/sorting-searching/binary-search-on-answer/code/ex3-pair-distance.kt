// Saare jodo (i < j) ki doori |a[i] - a[j]| ko sort karo to k-th sabse chhoti doori?
fun smallestDistancePair(nums: IntArray, k: Int): Int {
    val a = nums.sorted().toIntArray()
    var lo = 0
    var hi = a.last() - a.first() // doori isse zyada ho hi nahi sakti //@init
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2 //@mid
        if (countPairs(a, mid) >= k) hi = mid // doori <= mid wale jode k ya zyada: answer <= mid //@ok
        else lo = mid + 1 //@notok
    }
    return lo //@done
}

// Kitne jodo ki doori <= d? Sorted array par two pointers - O(n)
fun countPairs(a: IntArray, d: Int): Int {
    var count = 0
    var l = 0
    for (r in a.indices) {
        while (a[r] - a[l] > d) l++ // l ko itna aage lao ki a[r] - a[l] <= d
        count += r - l // r ke saath l..r-1 sab jode chalenge //@count
    }
    return count
}

fun main() {
    println(smallestDistancePair(intArrayOf(1, 3, 4, 8, 10), 4))
    println(smallestDistancePair(intArrayOf(1, 3, 1), 1))
    println(smallestDistancePair(intArrayOf(1, 6, 1), 3))
}

// Output:
// 3
// 0
// 5
