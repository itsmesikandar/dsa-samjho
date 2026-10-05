// Sorted array: har number ZYADA SE ZYADA 2 baar rahe (in-place). Naya length return.
fun removeDuplicatesII(nums: IntArray): Int {
    var w = 0 // kitne items likh chuke //@init
    for (x in nums) {
        // pehle 2 hamesha rakho; uske baad tabhi jab 2 peeche wale (likhe hue) se alag ho
        if (w < 2 || x != nums[w - 2]) { //@check
            nums[w] = x //@write
            w++
        }
    }
    return w //@done
}

fun main() {
    val a = intArrayOf(1, 1, 1, 2, 2, 3)
    val k = removeDuplicatesII(a)
    println(k)
    println(a.copyOf(k).contentToString())
}

// Output:
// 5
// [1, 1, 2, 2, 3]
