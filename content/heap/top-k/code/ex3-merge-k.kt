import java.util.PriorityQueue

class ListNode(var value: Int, var next: ListNode? = null)

// Har list ka sabse aage wala node heap mein; sabse chhota nikaalo, usi list ka agla daalo
fun mergeKLists(lists: Array<ListNode?>): ListNode? {
    val pq = PriorityQueue<ListNode>(compareBy { it.value })
    for (h in lists) if (h != null) pq.add(h) // har list ka head (khaali list skip) //@init
    val dummy = ListNode(0)
    var tail = dummy
    while (pq.isNotEmpty()) {
        val node = pq.poll() // sab heads mein sabse chhota //@take
        tail.next = node // result ke end par jodo
        tail = node
        node.next?.let { pq.add(it) } // usi list ka agla node ab head //@next
    }
    return dummy.next //@done
}

fun build(vararg xs: Int): ListNode? {
    var head: ListNode? = null
    for (x in xs.reversed()) head = ListNode(x, head)
    return head
}

fun show(head: ListNode?): String {
    val parts = mutableListOf<String>()
    var cur = head
    while (cur != null) {
        parts.add(cur.value.toString())
        cur = cur.next
    }
    return if (parts.isEmpty()) "(khaali)" else parts.joinToString(" -> ")
}

fun main() {
    println(show(mergeKLists(arrayOf(build(1, 4, 5), build(1, 3, 4), build(2, 6)))))
    println(show(mergeKLists(arrayOf(null, build(2, 5), null))))
    println(show(mergeKLists(arrayOf())))
}

// Output:
// 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
// 2 -> 5
// (khaali)
