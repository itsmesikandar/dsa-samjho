class ListNode(var value: Int, var next: ListNode? = null)

// pos (0 se) par naya node daalo; (shayad naya) head return karo
fun insertAt(head: ListNode?, pos: Int, value: Int): ListNode? {
    val node = ListNode(value)
    if (pos == 0) { // sabse aage: naya node hi head ban jaata hai //@head
        node.next = head
        return node
    }
    var prev = head
    repeat(pos - 1) { prev = prev?.next } // pos se ek PEHLE wale node tak chalo - O(pos) //@walk
    val p = prev ?: return head // pos list se bahar: kuch mat karo
    node.next = p.next // 1. naya node aage wale ko pakde //@link1
    p.next = node // 2. phir pichhla naya node ko pakde (ulta kiya to aage ki list kho jaayegi) //@link2
    return head
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
    var head = build(10, 20, 40)
    head = insertAt(head, 2, 30)
    println(show(head))
    head = insertAt(head, 0, 5)
    println(show(head))
}

// Output:
// 10 -> 20 -> 30 -> 40
// 5 -> 10 -> 20 -> 30 -> 40
