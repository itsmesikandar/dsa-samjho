// Fixed size ka circular queue: array ke end ke baad index wapas 0 par ghoomta hai
class MyCircularQueue(k: Int) {
    private val a = IntArray(k)
    private var head = 0 // aage wala item yahan
    private var count = 0 // kitne bhare - isse 'full' aur 'empty' alag pehchaante hain

    fun enQueue(x: Int): Boolean {
        if (isFull()) return false //@full
        a[(head + count) % a.size] = x // peeche ki khaali jagah; end ke baad % se wapas 0 //@enq
        count++
        return true
    }

    fun deQueue(): Boolean {
        if (isEmpty()) return false //@empty
        head = (head + 1) % a.size // aage wala gaya: head ek aage (ghoom ke) - koi shift nahi //@deq
        count--
        return true
    }

    fun front() = if (isEmpty()) -1 else a[head]

    fun rear() = if (isEmpty()) -1 else a[(head + count - 1) % a.size]

    fun isEmpty() = count == 0

    fun isFull() = count == a.size
}

fun main() {
    val q = MyCircularQueue(3)
    println(q.enQueue(1))
    println(q.enQueue(2))
    println(q.enQueue(3))
    println(q.enQueue(4)) // bhara hai
    println(q.rear())
    println(q.isFull())
    println(q.deQueue())
    println(q.enQueue(4)) // khaali hui jagah (index 0) dobara use
    println(q.rear())
}

// Output:
// true
// true
// true
// false
// 3
// true
// true
// true
// 4
