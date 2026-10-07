import kotlin.math.abs

// Sorted array (negative bhi) ke squares, sorted order mein - O(n)
fun sortedSquares(nums: IntArray): IntArray {
    val n = nums.size
    val res = IntArray(n)
    var l = 0 //@init
    var r = n - 1
    for (k in n - 1 downTo 0) { // sabse bada square kisi ek EDGE par hoga -> res ko peeche se bharo
        if (abs(nums[l]) > abs(nums[r])) { // kaunse edge ka square bada? //@compare
            res[k] = nums[l] * nums[l] //@left
            l++
        } else {
            res[k] = nums[r] * nums[r] //@right
            r--
        }
    }
    return res //@done
}

fun main() {
    println(sortedSquares(intArrayOf(-4, -1, 0, 3, 10)).contentToString())
    println(sortedSquares(intArrayOf(-7, -3, 2, 3, 11)).contentToString())
}

// Output:
// [0, 1, 9, 16, 100]
// [4, 9, 9, 49, 121]
