class ListNode(var value: Int, var next: ListNode? = null)

// L0 -> L1 -> ... -> Ln ko L0 -> Ln -> L1 -> Ln-1 -> ... banao (in-place, values nahi badalni)
fun reorderList(head: ListNode?) {
    if (head == null) return
    var slow: ListNode = head
    var fast: ListNode? = head
    while (fast != null && fast.next != null) { // 1. beech dhoondho //@middle
        slow = slow.next!!
        fast = fast.next?.next
    }
    var second = reverse(slow.next) // 2. doosra aadha ulta (Ln, Ln-1, ...) //@reverse
    slow.next = null // pehla aadha alag
    var first: ListNode? = head
    while (second != null) { // 3. baari-baari: ek pehle se, ek doosre se //@weave
        val f = first!!
        val n1 = f.next
        val n2 = second.next
        f.next = second
        second.next = n1
        first = n1
        second = n2
    }
}

fun reverse(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var cur = head
    while (cur != null) {
        val nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    }
    return prev
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
    val a = build(1, 2, 3, 4, 5)
    reorderList(a)
    println(show(a))
    val b = build(1, 2, 3, 4)
    reorderList(b)
    println(show(b))
}

// Output:
// 1 -> 5 -> 2 -> 4 -> 3
// 1 -> 4 -> 2 -> 3
