fun main() {
    val q = ArrayDeque<String>() // queue: peeche jodo (addLast), aage se nikaalo (removeFirst)
    q.addLast("Ravi") // enqueue
    q.addLast("Anu")
    q.addLast("Zoya")
    println(q.first()) // aage kaun hai (nikaalo mat)
    println(q.removeFirst()) // dequeue: jo pehle aaya wo pehle gaya
    println(q)
    println(q.size)
}

// Output:
// Ravi
// Ravi
// [Anu, Zoya]
// 2
