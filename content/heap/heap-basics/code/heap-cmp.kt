import java.util.Collections

// Ek hi heap code min aur max dono ke liye: bas "kaun upar aaye" ka Comparator badlo
class Heap(private val cmp: Comparator<Int>) {
    private val a = mutableListOf<Int>()

    fun isEmpty() = a.isEmpty()

    // a[i] ko a[j] se upar hona chahiye?
    private fun before(i: Int, j: Int) = cmp.compare(a[i], a[j]) < 0

    fun push(x: Int) {
        a.add(x)
        var i = a.size - 1
        while (i > 0 && before(i, (i - 1) / 2)) {
            Collections.swap(a, i, (i - 1) / 2)
            i = (i - 1) / 2
        }
    }

    fun pop(): Int {
        val top = a[0]
        val last = a.removeAt(a.size - 1)
        if (a.isNotEmpty()) {
            a[0] = last
            var i = 0
            while (true) {
                val l = 2 * i + 1
                val r = l + 1
                var m = i
                if (l < a.size && before(l, m)) m = l
                if (r < a.size && before(r, m)) m = r
                if (m == i) break
                Collections.swap(a, i, m)
                i = m
            }
        }
        return top
    }
}

fun drain(h: Heap): List<Int> {
    val out = mutableListOf<Int>()
    while (!h.isEmpty()) out.add(h.pop())
    return out
}

fun main() {
    val minH = Heap(naturalOrder()) // chhota upar
    val maxH = Heap(reverseOrder()) // bada upar
    for (x in intArrayOf(5, 1, 8, 3, 9, 3)) {
        minH.push(x)
        maxH.push(x)
    }
    println(drain(minH))
    println(drain(maxH))
}

// Output:
// [1, 3, 3, 5, 8, 9]
// [9, 8, 5, 3, 3, 1]
