class ListNode(var value: Int, var next: ListNode? = null)

// Circle kis node se shuru hota hai? Na ho to null. O(1) memory.
fun detectCycle(head: ListNode?): ListNode? {
    var slow = head
    var fast = head
    while (fast != null && fast.next != null) {
        slow = slow?.next //@step
        fast = fast.next?.next
        if (slow === fast) { // mile: circle pakka hai
            var p = head // ek pointer head par wapas //@restart
            while (p !== slow) { // dono 1-1 kadam: circle ki shuruaat par milenge (maths neeche) //@walk
                p = p?.next
                slow = slow?.next
            }
            return p //@start
        }
    }
    return null //@none
}

fun buildCycle(values: IntArray, pos: Int): ListNode? {
    val nodes = values.map { ListNode(it) }
    for (i in 0 until nodes.size - 1) nodes[i].next = nodes[i + 1]
    if (pos >= 0) nodes.last().next = nodes[pos]
    return nodes.firstOrNull()
}

fun main() {
    println(detectCycle(buildCycle(intArrayOf(3, 2, 0, -4), 1))?.value)
    println(detectCycle(buildCycle(intArrayOf(1, 2), 0))?.value)
    println(detectCycle(buildCycle(intArrayOf(1), -1))?.value)
}

// Output:
// 2
// 1
// null
