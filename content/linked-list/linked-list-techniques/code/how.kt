class ListNode(var value: Int, var next: ListNode? = null)

// Do sorted lists ko ek sorted list mein jodo (naye nodes nahi - wahi nodes re-link)
fun mergeTwoLists(a: ListNode?, b: ListNode?): ListNode? {
    val dummy = ListNode(0) // nakli shuruaat: "pehla node kaun" wala special case khatam
    var tail = dummy // result ka aakhri node //@init
    var p = a
    var q = b
    while (p != null && q != null) {
        if (p.value <= q.value) { // chhota jodo; barabar par pehli list wala (stable) //@pick
            tail.next = p
            p = p.next
        } else {
            tail.next = q
            q = q.next
        }
        tail = tail.next!!
    }
    tail.next = p ?: q // jo list bachi, poori jod do - wo pehle se sorted hai //@rest
    return dummy.next // asli head = dummy ke baad wala //@done
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
    println(show(mergeTwoLists(build(1, 2, 4), build(1, 3, 4))))
    println(show(mergeTwoLists(build(), build(0))))
}

// Output:
// 1 -> 1 -> 2 -> 3 -> 4 -> 4
// 0
