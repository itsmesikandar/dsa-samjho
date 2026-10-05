class DNode(val value: Int) {
    var prev: DNode? = null
    var next: DNode? = null
}

// Doubly list ulti karo: har node ke prev aur next swap; naya head = purana aakhri node
fun reverse(head: DNode?): DNode? {
    var cur = head
    var newHead: DNode? = null
    while (cur != null) {
        val nxt = cur.next // swap se pehle aage ka raasta bachao //@save
        cur.next = cur.prev // dono arrows ulte //@swap
        cur.prev = nxt
        newHead = cur // aakhri dekha node hi naya head banega //@head
        cur = nxt
    }
    return newHead
}

fun build(vararg xs: Int): DNode? {
    var head: DNode? = null
    var last: DNode? = null
    for (x in xs) {
        val n = DNode(x)
        n.prev = last
        if (last == null) head = n else last.next = n
        last = n
    }
    return head
}

fun forward(head: DNode?): String {
    val out = mutableListOf<Int>()
    var c = head
    while (c != null) {
        out.add(c.value)
        c = c.next
    }
    return out.toString()
}

fun backward(head: DNode?): String { // end tak jao, phir prev se wapas - prev arrows sahi hain ya nahi?
    var c = head
    while (true) c = c?.next ?: break
    val out = mutableListOf<Int>()
    while (c != null) {
        out.add(c.value)
        c = c.prev
    }
    return out.toString()
}

fun main() {
    val h = reverse(build(1, 2, 3, 4))
    println(forward(h))
    println(backward(h))
}

// Output:
// [4, 3, 2, 1]
// [1, 2, 3, 4]
