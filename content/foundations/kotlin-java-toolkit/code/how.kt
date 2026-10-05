fun main() {
    val values = intArrayOf(1, 2, 3)

    // ArrayDeque ko STACK ki tarah: last mein daalo, last se nikaalo (LIFO)
    val stack = ArrayDeque<Int>()
    for (v in values) stack.addLast(v) // push: upar rakho //@push
    println(stack.removeLast()) // pop: jo last aaya wahi pehle niklega //@pop

    // Wahi ArrayDeque QUEUE ki tarah: last mein daalo, first se nikaalo (FIFO)
    val queue = ArrayDeque<Int>()
    for (v in values) queue.addLast(v) // enqueue: line mein peeche lago //@enq
    println(queue.removeFirst()) // dequeue: jo pehle aaya wahi pehle niklega //@deq

    println(stack)
    println(queue)
}

// Output:
// 3
// 1
// [1, 2]
// [2, 3]
