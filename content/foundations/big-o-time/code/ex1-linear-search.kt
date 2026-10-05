// x ko dhoondhne mein kitne comparisons lage? (best, worst case samajhne ke liye)
fun comparisons(arr: IntArray, x: Int): Int {
    var count = 0
    for (i in arr.indices) {
        count++ // ek comparison hua //@cmp
        if (arr[i] == x) return count // mil gaya, ruk jao //@found
    }
    return count // poora array dekh liya, nahi mila //@notfound
}

fun main() {
    val arr = intArrayOf(7, 3, 9, 5, 1)
    println(comparisons(arr, 5)) // average jaisa case
    println(comparisons(arr, 7)) // best case: pehla hi item
    println(comparisons(arr, 8)) // worst case: nahi mila, saare n dekhe
}

// Output:
// 4
// 1
// 5
