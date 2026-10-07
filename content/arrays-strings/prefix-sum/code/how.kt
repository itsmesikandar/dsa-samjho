// Ek baar O(n) mein prefix banao, phir har range-sum query O(1)
class RangeSum(arr: IntArray) {
    private val pre = LongArray(arr.size + 1) // pre[k] = pehle k items ka total; pre[0] = 0 //@alloc

    init {
        for (i in arr.indices) pre[i + 1] = pre[i] + arr[i] // ab tak ka total + agla item //@build
    }

    // arr[l..r] (dono include) ka sum
    fun sum(l: Int, r: Int): Long = pre[r + 1] - pre[l] //@query
}

fun main() {
    val rs = RangeSum(intArrayOf(3, 1, 4, 1, 5, 9))
    println(rs.sum(1, 3)) // 1 + 4 + 1
    println(rs.sum(0, 5)) // poora array
    println(rs.sum(4, 4)) // sirf ek item
}

// Output:
// 6
// 23
// 5
