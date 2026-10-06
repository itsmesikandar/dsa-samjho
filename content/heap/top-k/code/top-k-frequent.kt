import java.util.PriorityQueue

// k sabse zyada baar aane wale: pehle HashMap mein count, phir count par size k ka min-heap
fun topKFrequent(nums: IntArray, k: Int): List<Int> {
    val count = HashMap<Int, Int>()
    for (x in nums) count[x] = (count[x] ?: 0) + 1
    // kam count upar (barabar ho to bada number upar - wahi pehle bahar, taaki output pakka rahe)
    val pq = PriorityQueue<Int>(compareBy<Int>({ count[it] }, { -it }))
    for (x in count.keys) {
        pq.add(x)
        if (pq.size > k) pq.poll() // sabse kam count wala bahar
    }
    return pq.sortedWith(compareBy<Int>({ -count[it]!! }, { it })) // zyada count pehle
}

fun main() {
    println(topKFrequent(intArrayOf(1, 1, 1, 2, 2, 3), 2))
    println(topKFrequent(intArrayOf(4, 4, 5, 5, 6), 1))
}

// Output:
// [1, 2]
// [4]
