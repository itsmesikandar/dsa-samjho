import java.util.PriorityQueue

// Signal sab tak kab pahunchega = sabse door wale node ki shortest doori (k se)
fun networkDelayTime(times: Array<IntArray>, n: Int, k: Int): Int {
    val adj = List(n + 1) { mutableListOf<IntArray>() } // nodes 1..n
    for ((u, v, w) in times) adj[u].add(intArrayOf(v, w))
    val dist = IntArray(n + 1) { Int.MAX_VALUE }
    val pq = PriorityQueue<IntArray>(compareBy { it[1] })
    dist[k] = 0
    pq.add(intArrayOf(k, 0)) //@start
    while (pq.isNotEmpty()) {
        val (u, d) = pq.poll() //@poll
        if (d > dist[u]) continue
        for ((v, w) in adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w //@relax
                pq.add(intArrayOf(v, dist[v]))
            }
        }
    }
    var ans = 0
    for (v in 1..n) {
        if (dist[v] == Int.MAX_VALUE) return -1 // koi node tak signal pahuncha hi nahi //@unreached
        ans = maxOf(ans, dist[v]) // sab tak tab pahunchega jab sabse late wale tak //@max
    }
    return ans
}

fun main() {
    val times = arrayOf(
        intArrayOf(1, 2, 4), intArrayOf(1, 3, 1), intArrayOf(3, 2, 2),
        intArrayOf(2, 4, 1), intArrayOf(3, 5, 7), intArrayOf(4, 5, 3),
    )
    println(networkDelayTime(times, 5, 1))
    println(networkDelayTime(times, 5, 2))
    println(networkDelayTime(arrayOf(intArrayOf(1, 2, 1)), 2, 1))
}

// Output:
// 7
// -1
// 1
