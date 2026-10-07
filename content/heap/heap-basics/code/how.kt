import java.util.Collections

// Min-heap: ek array mein complete tree. Index i ke bachche 2i+1, 2i+2; parent (i-1)/2
class MinHeap {
    private val a = mutableListOf<Int>()

    fun size() = a.size

    fun peek() = a[0] // sabse chhota hamesha root (index 0) par

    fun push(x: Int) {
        a.add(x) // aakhri khaali jagah par - shape complete rehti hai //@add
        var i = a.size - 1
        while (i > 0 && a[(i - 1) / 2] > a[i]) { // parent bada hai - order toota //@cmpUp
            Collections.swap(a, i, (i - 1) / 2) // ek level upar chadho //@up
            i = (i - 1) / 2
        }
    }

    fun pop(): Int {
        val top = a[0]
        val last = a.removeAt(a.size - 1) // aakhri nikaalo - beech mein hole nahi banta //@last
        if (a.isNotEmpty()) {
            a[0] = last // root par rakho, phir neeche push karo (sift down) //@root
            var i = 0
            while (true) {
                val l = 2 * i + 1
                val r = l + 1
                var m = i
                if (l < a.size && a[l] < a[m]) m = l // dono bachchon mein jo chhota //@pick
                if (r < a.size && a[r] < a[m]) m = r
                if (m == i) break // bachche bade (ya hain hi nahi) - jagah mil gayi //@stop
                Collections.swap(a, i, m) // chhota bachcha upar, ye neeche //@down
                i = m
            }
        }
        return top
    }
}

fun main() {
    val h = MinHeap()
    val popped = mutableListOf<Int>()
    for (x in intArrayOf(5, 3, 8, 2)) h.push(x)
    popped.add(h.pop())
    h.push(1)
    popped.add(h.pop())
    println(popped)
    println("${h.peek()} ${h.size()}")
}

// Output:
// [2, 1]
// 3 3
