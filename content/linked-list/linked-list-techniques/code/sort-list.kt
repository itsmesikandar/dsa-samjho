class ListNode(var value: Int, var next: ListNode? = null)

// Linked list ka merge sort: beech se todo (fast/slow), dono sort (recursion), merge (dummy)
fun sortList(head: ListNode?): ListNode? {
    if (head == null || head.next == null) return head
    var slow: ListNode = head
    var fast: ListNode? = head.next // fast ek aage se: slow PEHLE beech par rukega (2 nodes bhi do mein tootein)
    while (fast != null && fast.next != null) {
        slow = slow.next!!
        fast = fast.next?.next
    }
    val right = slow.next
    slow.next = null // list do hisson mein kaat di
    return merge(sortList(head), sortList(right))
}

fun merge(a: ListNode?, b: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var tail = dummy
    var p = a
    var q = b
    while (p != null && q != null) {
        if (p.value <= q.value) {
            tail.next = p
            p = p.next
        } else {
            tail.next = q
            q = q.next
        }
        tail = tail.next!!
    }
    tail.next = p ?: q
    return dummy.next
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
    println(show(sortList(build(4, 2, 1, 3))))
    println(show(sortList(build(-1, 5, 3, 4, 0))))
}

// Output:
// 1 -> 2 -> 3 -> 4
// -1 -> 0 -> 3 -> 4 -> 5
