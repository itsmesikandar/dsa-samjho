// Sorted array se duplicates hatao (in-place). Kitne unique bache, wo return karo.
fun removeDuplicates(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    var w = 1 // agla unique item kahan likhna hai (index 0 hamesha unique) //@init
    for (r in 1 until nums.size) { // r: padhne wala pointer, hamesha aage
        if (nums[r] != nums[w - 1]) { // pichle LIKHE item se alag = naya unique //@check
            nums[w] = nums[r] //@write
            w++
        }
    }
    return w // pehle w items unique hain //@done
}

fun main() {
    val a = intArrayOf(0, 0, 1, 1, 1, 2, 2, 3, 3, 4)
    val k = removeDuplicates(a)
    println(k)
    println(a.copyOf(k).contentToString())
}

// Output:
// 5
// [0, 1, 2, 3, 4]
