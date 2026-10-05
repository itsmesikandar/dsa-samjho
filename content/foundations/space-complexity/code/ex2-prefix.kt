// O(n) extra memory dekar har range-sum query O(1) mein
fun buildPrefix(arr: IntArray): LongArray {
    val pre = LongArray(arr.size + 1) // n+1 extra dabbe; pre[0] = 0 //@alloc
    for (i in arr.indices) {
        pre[i + 1] = pre[i] + arr[i] // ab tak ka total //@fill
    }
    return pre
}

// arr[l..r] ka sum = pre[r+1] - pre[l]
fun rangeSum(pre: LongArray, l: Int, r: Int): Long {
    return pre[r + 1] - pre[l] //@query
}

fun main() {
    val pre = buildPrefix(intArrayOf(2, 4, 1, 5, 3))
    println(rangeSum(pre, 1, 3)) // 4 + 1 + 5
    println(rangeSum(pre, 0, 4)) // poora array
}

// Output:
// 10
// 15
