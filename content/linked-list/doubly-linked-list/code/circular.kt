// Circular list: aakhri node ka next wapas pehle ko. Josephus game:
// n log circle mein, har k-th insaan bahar. Kis order mein bahar honge?
class CNode(val value: Int) {
    var next: CNode = this // akela node khud ko point kare
}

fun eliminationOrder(n: Int, k: Int): List<Int> {
    val first = CNode(1)
    var last = first
    for (v in 2..n) {
        val node = CNode(v)
        last.next = node
        last = node
    }
    last.next = first // aakhri wapas pehle ko: circle poora
    val out = mutableListOf<Int>()
    var prev = last // jise hataana hai uske PICHHLE par khade raho
    repeat(n) {
        repeat(k - 1) { prev = prev.next } // k - 1 aage gino (circle hai, null kabhi nahi)
        val gone = prev.next
        out.add(gone.value)
        prev.next = gone.next // circle se bahar
    }
    return out
}

fun main() {
    println(eliminationOrder(5, 2))
    println(eliminationOrder(7, 3))
}

// Output:
// [2, 4, 1, 5, 3]
// [3, 6, 2, 7, 5, 1, 4]
