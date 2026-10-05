// LRU Cache: capacity bhar jaaye to sabse PURANA use hua item nikaalo. get/put dono O(1).
class LRUCache(private val capacity: Int) {
    private class Node(val key: Int, var value: Int) {
        var prev: Node? = null
        var next: Node? = null
    }

    private val map = HashMap<Int, Node>() // key -> node: O(1) mein node haath mein
    private val head = Node(0, 0) // head ke baad = sabse naya use hua
    private val tail = Node(0, 0) // tail se pehle = sabse purana (pehle niklega)

    init {
        head.next = tail
        tail.prev = head
    }

    private fun unlink(n: Node) { // doubly ka fayda: O(1) mein beech se nikaalo
        n.prev!!.next = n.next
        n.next!!.prev = n.prev
    }

    private fun addFront(n: Node) {
        n.next = head.next
        n.prev = head
        head.next!!.prev = n
        head.next = n
    }

    fun get(key: Int): Int {
        val n = map[key] ?: return -1 //@miss
        unlink(n) // abhi use hua: sabse aage le jao //@touch
        addFront(n)
        return n.value
    }

    fun put(key: Int, value: Int) {
        val old = map[key]
        if (old != null) { // pehle se hai: value badlo, aage le jao //@update
            old.value = value
            unlink(old)
            addFront(old)
            return
        }
        if (map.size == capacity) { // jagah nahi: sabse purana (tail se pehle wala) nikaalo //@evict
            val lru = tail.prev!!
            unlink(lru)
            map.remove(lru.key)
        }
        val n = Node(key, value) //@insert
        addFront(n)
        map[key] = n
    }
}

fun main() {
    val c = LRUCache(2)
    c.put(1, 1)
    c.put(2, 2)
    println(c.get(1)) // 1 ab sabse naya
    c.put(3, 3) // jagah nahi: 2 (sabse purana) gaya
    println(c.get(2))
    c.put(4, 4) // ab 1 sabse purana: gaya
    println(c.get(1))
    println(c.get(3))
    println(c.get(4))
}

// Output:
// 1
// -1
// -1
// 3
// 4
