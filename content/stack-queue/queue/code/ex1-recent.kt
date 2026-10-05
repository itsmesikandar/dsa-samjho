// ping(t): t time par call aayi. Pichhle 3000 ms (t - 3000 se t tak) mein kitni calls? (t badhta hi hai)
class RecentCounter {
    private val q = ArrayDeque<Int>()

    fun ping(t: Int): Int {
        q.addLast(t) // nayi call peeche //@add
        while (q.first() < t - 3000) q.removeFirst() // window se bahar wali purani calls aage se hatao //@drop
        return q.size //@count
    }
}

fun main() {
    val rc = RecentCounter()
    println(rc.ping(1))
    println(rc.ping(100))
    println(rc.ping(3001))
    println(rc.ping(3002))
}

// Output:
// 1
// 2
// 3
// 3
