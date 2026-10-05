class ListNode(var value: Int, var next: ListNode? = null)

// List mein circle (cycle) hai? O(1) extra memory.
fun hasCycle(head: ListNode?): Boolean {
    var slow = head
    var fast = head
    while (fast != null && fast.next != null) {
        slow = slow?.next //@step
        fast = fast.next?.next
        if (slow === fast) return true // tez wala peeche se aa ke mil gaya: circle hai //@meet
    }
    return false // fast ko end (null) mil gaya: circle nahi //@end
}

// values se list; aakhri node index pos par wapas jude (pos = -1: koi circle nahi)
fun buildCycle(values: IntArray, pos: Int): ListNode? {
    val nodes = values.map { ListNode(it) }
    for (i in 0 until nodes.size - 1) nodes[i].next = nodes[i + 1]
    if (pos >= 0) nodes.last().next = nodes[pos]
    return nodes.firstOrNull()
}

fun main() {
    println(hasCycle(buildCycle(intArrayOf(3, 2, 0, -4), 1)))
    println(hasCycle(buildCycle(intArrayOf(1, 2), -1)))
}

// Output:
// true
// false
