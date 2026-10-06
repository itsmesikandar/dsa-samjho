import java.util.PriorityQueue

fun dist(p: IntArray) = p[0] * p[0] + p[1] * p[1] // sqrt ki zaroorat nahi - order same

// k sabse paas: distance par MAX-heap, size k. Sabse door wala root par - wahi bahar jaayega
fun kClosest(points: Array<IntArray>, k: Int): List<List<Int>> {
    val pq = PriorityQueue<IntArray>(compareByDescending { dist(it) }) //@init
    for (p in points) {
        pq.add(p) //@add
        if (pq.size > k) pq.poll() // sabse door wala bahar //@trim
    }
    // jawab kisi bhi order mein chalega; yahan paas se door (tie par x, y) taaki output pakka ho
    return pq.sortedWith(compareBy({ dist(it) }, { it[0] }, { it[1] })).map { it.toList() } //@ans
}

fun main() {
    val pts = arrayOf(intArrayOf(1, 3), intArrayOf(-2, 2), intArrayOf(5, -1), intArrayOf(0, 4), intArrayOf(3, 3))
    println(kClosest(pts, 2))
    println(kClosest(arrayOf(intArrayOf(3, 3), intArrayOf(5, -1), intArrayOf(-2, 4)), 2))
}

// Output:
// [[-2, 2], [1, 3]]
// [[3, 3], [-2, 4]]
