import java.util.Collections
import java.util.PriorityQueue

fun main() {
    val minPq = PriorityQueue<Int>() // default: chhota upar
    val maxPq = PriorityQueue<Int>(Collections.reverseOrder()) // bada upar
    for (x in intArrayOf(5, 1, 8, 3, 2)) {
        minPq.add(x) // offer() bhi same
        maxPq.add(x)
    }
    println(minPq.peek()) // dekha, nikaala nahi; khaali par null
    println(minPq) // andar ka ARRAY - sorted nahi!
    val sorted = mutableListOf<Int>()
    while (minPq.isNotEmpty()) sorted.add(minPq.poll()) // nikaalo; khaali par null
    println(sorted)
    println(maxPq.poll())

    // Object / pair: Comparator do. Yahan pehle length, barabar ho to alphabet
    val words = PriorityQueue(compareBy<String> { it.length }.thenBy { it })
    words.addAll(listOf("kela", "aam", "seb", "angoor"))
    println(words.poll() + " " + words.poll())
}

// Output:
// 1
// [1, 2, 8, 5, 3]
// [1, 2, 3, 5, 8]
// 8
// aam seb
