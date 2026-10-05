// k-th sabse bada number (sorted order ka k-th; distinct nahi). Quickselect: average O(n)
fun findKthLargest(nums: IntArray, k: Int): Int {
    val target = nums.size - k // badhte order mein ye index chahiye
    var l = 0
    var r = nums.size - 1
    while (true) {
        val p = partition(nums, l, r) // pivot apni pakki jagah p par pahuncha //@part
        when {
            p == target -> return nums[p] //@found
            p < target -> l = p + 1 // answer right mein: left wala hissa bhool jao //@right
            else -> r = p - 1 // answer left mein //@left
        }
    }
}

// Quick sort wala Lomuto partition (beech wala pivot)
fun partition(a: IntArray, l: Int, r: Int): Int {
    swap(a, (l + r) / 2, r)
    val pivot = a[r]
    var s = l
    for (i in l until r) {
        if (a[i] < pivot) {
            swap(a, i, s)
            s++
        }
    }
    swap(a, s, r)
    return s
}

fun swap(a: IntArray, i: Int, j: Int) {
    val t = a[i]
    a[i] = a[j]
    a[j] = t
}

fun main() {
    println(findKthLargest(intArrayOf(3, 2, 1, 5, 6, 4), 2))
    println(findKthLargest(intArrayOf(3, 2, 3, 1, 2, 4, 5, 5, 6), 4))
}

// Output:
// 5
// 4
