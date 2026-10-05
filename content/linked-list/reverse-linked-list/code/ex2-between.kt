class ListNode(var value: Int, var next: ListNode? = null)

// Sirf position left se right tak (1 se ginti) wala tukda ulta karo, ek pass mein
fun reverseBetween(head: ListNode?, left: Int, right: Int): ListNode? {
    val dummy = ListNode(0, head) // left = 1 ho tab bhi 'pehle wala' node mile
    var before: ListNode = dummy
    for (i in 1 until left) before = before.next!! // tukde se theek pehle wala node //@walk
    val start = before.next!! // tukde ka pehla - ulta hone ke baad aakhri banega
    var prev: ListNode? = null
    var cur: ListNode? = start
    for (i in left..right) { // sirf tukde ke arrows ulte //@flip
        val c = cur!!
        val nxt = c.next
        c.next = prev
        prev = c
        cur = nxt
    }
    before.next = prev // pehle wala ab tukde ke naye shuru ko pakde //@join
    start.next = cur // purana shuru (ab aakhri) baaki list ko pakde
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
    println(show(reverseBetween(build(1, 2, 3, 4, 5), 2, 4)))
    println(show(reverseBetween(build(3, 5), 1, 2)))
}

// Output:
// 1 -> 4 -> 3 -> 2 -> 5
// 5 -> 3
