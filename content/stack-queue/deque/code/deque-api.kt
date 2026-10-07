fun main() {
    val d = ArrayDeque<Int>() // deque: dono edges par jodo / nikaalo, sab O(1)
    d.addLast(2)
    d.addFirst(1) // aage jodo
    d.addLast(3) // peeche jodo
    println(d)
    println(d.first()) // aage wala
    println(d.last()) // peeche wala
    d.removeFirst()
    d.removeLast()
    println(d)
}

// Output:
// [1, 2, 3]
// 1
// 3
// [2]
