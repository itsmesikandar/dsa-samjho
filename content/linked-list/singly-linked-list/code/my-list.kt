// Apni chhoti LinkedList: head + tail + size
class MyLinkedList {
    private class Node(val value: Int, var next: Node? = null)

    private var head: Node? = null
    private var tail: Node? = null // aakhri node yaad rakho: addLast O(1)
    var size = 0
        private set

    fun addFirst(x: Int) {
        val n = Node(x, head)
        head = n
        if (tail == null) tail = n // pehla hi node: head = tail
        size++
    }

    fun addLast(x: Int) {
        val n = Node(x)
        val t = tail
        if (t == null) head = n else t.next = n
        tail = n
        size++
    }

    fun removeFirst(): Int {
        val h = head ?: throw NoSuchElementException("list khaali hai")
        head = h.next
        if (head == null) tail = null // aakhri node gaya: tail bhi saaf
        size--
        return h.value
    }

    fun get(i: Int): Int { // index se lena O(i) - array jaisa O(1) nahi
        var cur = head
        repeat(i) { cur = cur?.next }
        return cur?.value ?: throw IndexOutOfBoundsException("index $i")
    }

    override fun toString(): String {
        val parts = mutableListOf<Int>()
        var cur = head
        while (cur != null) {
            parts.add(cur.value)
            cur = cur.next
        }
        return parts.toString()
    }
}

fun main() {
    val list = MyLinkedList()
    list.addLast(2)
    list.addLast(3)
    list.addFirst(1)
    println(list)
    println(list.get(2))
    println(list.removeFirst())
    println(list)
    println(list.size)
}

// Output:
// [1, 2, 3]
// 3
// 1
// [2, 3]
// 2
