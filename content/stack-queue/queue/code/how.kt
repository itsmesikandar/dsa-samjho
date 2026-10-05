// Do stacks se queue (FIFO): naye items 'inbox' mein, nikaalna 'outbox' se
class MyQueue {
    private val inbox = ArrayDeque<Int>() // stack: top = last
    private val outbox = ArrayDeque<Int>()

    fun push(x: Int) {
        inbox.addLast(x) //@push
    }

    fun pop(): Int {
        move()
        return outbox.removeLast() // outbox ka top = sabse purana item //@pop
    }

    fun peek(): Int {
        move()
        return outbox.last()
    }

    fun empty() = inbox.isEmpty() && outbox.isEmpty()

    // outbox KHAALI ho tabhi inbox ko ulta karke daalo - har item zindagi mein ek hi baar shift hota hai
    private fun move() {
        if (outbox.isEmpty()) {
            while (inbox.isNotEmpty()) outbox.addLast(inbox.removeLast()) //@move
        }
    }
}

fun main() {
    val q = MyQueue()
    q.push(1)
    q.push(2)
    println(q.peek())
    println(q.pop())
    q.push(3)
    println(q.pop())
    println(q.pop())
    println(q.empty())
}

// Output:
// 1
// 1
// 2
// 3
// true
