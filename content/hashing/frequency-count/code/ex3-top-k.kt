// Sabse zyada baar aane wale k numbers - bucket sort se O(n), bina poora sort kiye
fun topKFrequent(nums: IntArray, k: Int): List<Int> {
    val freq = HashMap<Int, Int>()
    for (x in nums) freq[x] = freq.getOrDefault(x, 0) + 1 // pehle ginti //@count
    // bucket[f] = wo numbers jo exactly f baar aaye. f zyada se zyada n ho sakta hai.
    val bucket = Array(nums.size + 1) { mutableListOf<Int>() } //@bucket
    for ((x, f) in freq) bucket[f].add(x)
    val res = ArrayList<Int>()
    for (f in nums.size downTo 1) { // sabse badi frequency se neeche aao
        for (x in bucket[f].sorted()) { // (sorted sirf output fix rakhne ke liye) //@pick
            if (res.size < k) res.add(x)
        }
    }
    return res //@done
}

fun main() {
    println(topKFrequent(intArrayOf(1, 1, 1, 2, 2, 3), 2))
    println(topKFrequent(intArrayOf(4, 4, 5, 5, 6), 2))
}

// Output:
// [1, 2]
// [4, 5]
