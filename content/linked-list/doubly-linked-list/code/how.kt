class DNode(val value: Int) {
    var prev: DNode? = null
    var next: DNode? = null
}

// Doubly list: aage aur peeche dono taraf arrow. head/tail nakli (sentinel) nodes - kabhi null check nahi.
class DList {
    val head = DNode(-1)
    val tail = DNode(-1)

    init {
        head.next = tail
        tail.prev = head
    }

    fun addLast(node: DNode) {
        val last = tail.prev!! // sentinel ki wajah se kabhi null nahi
        node.prev = last
        node.next = tail
        last.next = node
        tail.prev = node
    }

    // node ka pata hai to O(1) mein nikaalo (singly mein pichhla dhoondhna padta: O(n))
    fun remove(node: DNode) {
        val p = node.prev!! // pichhla aur agla dono node ke paas hi hain //@grab
        val n = node.next!!
        p.next = n // pichhla ab agle ko pakde //@link1
        n.prev = p // agla ab pichhle ko //@link2
        node.prev = null // purane node ke arrows saaf - galti se use na ho //@clean
        node.next = null
    }

    fun forward(): String {
        val out = mutableListOf<Int>()
        var c = head.next
        while (c != null && c !== tail) {
            out.add(c.value)
            c = c.next
        }
        return out.toString()
    }

    fun backward(): String {
        val out = mutableListOf<Int>()
        var c = tail.prev
        while (c != null && c !== head) {
            out.add(c.value)
            c = c.prev
        }
        return out.toString()
    }
}

fun main() {
    val list = DList()
    val nodes = listOf(10, 20, 30, 40).map { DNode(it) }
    nodes.forEach { list.addLast(it) }
    list.remove(nodes[2]) // 30 hatao - seedha node se
    println(list.forward())
    list.remove(nodes[0]) // pehla bhi bina special case ke
    println(list.forward())
    println("ulta: " + list.backward())
}

// Output:
// [10, 20, 40]
// [20, 40]
// ulta: [40, 20]
