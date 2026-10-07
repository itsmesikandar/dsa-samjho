class ListNode(var value: Int, var next: ListNode? = null)

// List se saare x wale nodes hata do
fun removeElements(head: ListNode?, x: Int): ListNode? {
    var h = head
    while (h != null && h.value == x) h = h.next // aage ke saare x hatao: head hi badal jaata hai //@head
    var cur = h
    while (cur != null) {
        val nxt = cur.next
        if (nxt != null && nxt.value == x) {
            cur.next = nxt.next // nxt ko beech se nikaalo: uske aage wale se jod do //@skip
        } else {
            cur = nxt // hataya nahi tabhi aage badho (continuous x ho sakte hain) //@move
        }
    }
    return h
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
    println(show(removeElements(build(1, 2, 6, 3, 4, 5, 6), 6)))
    println(show(removeElements(build(7, 7, 7, 7), 7)))
}

// Output:
// 1 -> 2 -> 3 -> 4 -> 5
// (khaali)
