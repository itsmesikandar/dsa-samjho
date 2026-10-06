import java.util.PriorityQueue

// Emergency ward: zyada severity pehle; barabar ho to jo pehle aaya wo pehle
fun treatOrder(sev: IntArray): List<Char> {
    val pq = PriorityQueue<IntArray> { x, y -> // x = [severity, aane ka number]
        if (x[0] != y[0]) Integer.compare(y[0], x[0]) // bada severity upar (ulta compare) //@cmp
        else Integer.compare(x[1], y[1]) // tie: jo pehle aaya wo upar
    }
    for (i in sev.indices) pq.add(intArrayOf(sev[i], i)) // end par + sift up, O(log n) //@add
    val order = mutableListOf<Char>()
    while (pq.isNotEmpty()) order.add('A' + pq.poll()[1]) // root nikaalo + sift down, O(log n) //@poll
    return order
}

fun main() {
    println(treatOrder(intArrayOf(2, 5, 1, 5, 3)))
    println(treatOrder(intArrayOf(4, 4, 4)))
}

// Output:
// [B, D, E, A, C]
// [A, B, C]
