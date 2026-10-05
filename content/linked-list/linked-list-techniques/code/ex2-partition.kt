class ListNode(var value: Int, var next: ListNode? = null)

// x se chhote sab pehle, baaki baad mein; dono hisson ka andar ka order wahi rahe
fun partition(head: ListNode?, x: Int): ListNode? {
    val lessDummy = ListNode(0) // do alag lists banao, dono ka nakli shuru
    val moreDummy = ListNode(0)
    var less = lessDummy
    var more = moreDummy
    var cur = head
    while (cur != null) {
        if (cur.value < x) { // chhota: 'less' list ke end mein //@less
            less.next = cur
            less = cur
        } else { // bada ya barabar: 'more' list ke end mein //@more
            more.next = cur
            more = cur
        }
        cur = cur.next
    }
    more.next = null // aakhri node ka purana next kaato - warna circle ban sakta hai //@cut
    less.next = moreDummy.next // chhoton ke baad bade //@join
    return lessDummy.next
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
    println(show(partition(build(1, 4, 3, 2, 5, 2), 3)))
    println(show(partition(build(2, 1), 2)))
}

// Output:
// 1 -> 2 -> 2 -> 4 -> 3 -> 5
// 1 -> 2
