class ListNode(var value: Int, var next: ListNode? = null)

// Pehle saare odd POSITION wale nodes (1st, 3rd, ...), phir even position wale. Order same, O(1) memory.
fun oddEvenList(head: ListNode?): ListNode? {
    if (head == null) return null
    var odd: ListNode = head
    val evenHead = head.next // even list ka shuru - aakhir mein odd list ke baad jodna hai
    var even = evenHead
    while (even != null && even.next != null) {
        odd.next = even.next // agla odd = even ke theek baad wala //@odd
        odd = odd.next!!
        even.next = odd.next // agla even = naye odd ke baad wala //@even
        even = even.next
    }
    odd.next = evenHead // odd list ke end par poori even list //@join
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
    println(show(oddEvenList(build(1, 2, 3, 4, 5))))
    println(show(oddEvenList(build(2, 1, 3, 5, 6, 4, 7))))
}

// Output:
// 1 -> 3 -> 5 -> 2 -> 4
// 2 -> 3 -> 6 -> 7 -> 1 -> 5 -> 4
