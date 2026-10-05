class ListNode(var value: Int, var next: ListNode? = null)

// Linked list ulti karo (in-place): har arrow ek-ek karke ulta
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var cur = head //@init
    while (cur != null) {
        val nxt = cur.next // aage ka raasta bachao - arrow ulta karte hi kho jaata //@save
        cur.next = prev // arrow ulta: ab peeche wale ko //@flip
        prev = cur // dono ek kadam aage //@move
        cur = nxt
    }
    return prev // cur null = sab ho gaya; prev = purana aakhri = naya head //@done
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
    println(show(reverseList(build(1, 2, 3, 4, 5))))
    println(show(reverseList(null)))
}

// Output:
// 5 -> 4 -> 3 -> 2 -> 1
// (khaali)
