class ListNode(var value: Int, var next: ListNode? = null)

// Aakhir se n-th node hatao - ek hi pass mein (length count kiye bina)
fun removeNthFromEnd(head: ListNode?, n: Int): ListNode? {
    val dummy = ListNode(0, head) // head hi hatana pade to bhi same code
    var fast: ListNode? = dummy
    for (i in 0..n) fast = fast?.next // fast ko n + 1 step aage: dono ke beech distance fix
    var slow: ListNode? = dummy
    while (fast != null) { // ab dono saath chalo; fast null par = slow hatane wale ke PICHHLE par
        fast = fast.next
        slow = slow?.next
    }
    slow?.next = slow?.next?.next
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
    println(show(removeNthFromEnd(build(1, 2, 3, 4, 5), 2)))
    println(show(removeNthFromEnd(build(1), 1)))
}

// Output:
// 1 -> 2 -> 3 -> 5
// (khaali)
