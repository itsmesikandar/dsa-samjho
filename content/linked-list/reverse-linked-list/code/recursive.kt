class ListNode(var value: Int, var next: ListNode? = null)

// Recursion se ulta: "baaki list ulti ho gayi" maan lo, phir apna ek arrow theek karo
fun reverseRec(head: ListNode?): ListNode? {
    if (head == null) return null
    val nxt = head.next ?: return head // ek hi node: ulta = wahi
    val newHead = reverseRec(nxt) // nxt se aage sab ulta (bharosa); newHead = purana aakhri node
    nxt.next = head // mera agla ab mujhe point kare
    head.next = null // main ab aakhri hoon
    return newHead
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
    println(show(reverseRec(build(1, 2, 3, 4))))
}

// Output:
// 4 -> 3 -> 2 -> 1
