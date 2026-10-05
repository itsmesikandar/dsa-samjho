class ListNode(var value: Int, var next: ListNode? = null)

// k-k nodes ke tukde ulte karo; aakhir mein k se kam bache to waise hi chhodo
fun reverseKGroup(head: ListNode?, k: Int): ListNode? {
    val dummy = ListNode(0, head)
    var groupPrev: ListNode = dummy // pichhle (ulte ho chuke) tukde ka aakhri node
    while (true) {
        var kth: ListNode? = groupPrev
        for (i in 0 until k) kth = kth?.next // aage poore k nodes hain? //@check
        if (kth == null) break // k se kam bache: chhod do
        val groupNext = kth.next // agle tukde ka pehla
        var prev: ListNode? = groupNext // ulta tukda seedha agle tukde se jude, isliye prev yahan se
        var cur = groupPrev.next
        while (cur !== groupNext) { // tukde ke arrows ulte //@flip
            val c = cur!!
            val nxt = c.next
            c.next = prev
            prev = c
            cur = nxt
        }
        val oldFirst = groupPrev.next!! // ulte hone ke baad ye tukde ka aakhri hai
        groupPrev.next = kth // pichhla tukda ab is tukde ke naye pehle (purane k-th) se jude //@join
        groupPrev = oldFirst
    }
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
    println(show(reverseKGroup(build(1, 2, 3, 4, 5), 2)))
    println(show(reverseKGroup(build(1, 2, 3, 4, 5), 3)))
}

// Output:
// 2 -> 1 -> 4 -> 3 -> 5
// 3 -> 2 -> 1 -> 4 -> 5
