import java.util.Collections

// Index k ka item hatao: aakhri item wahan rakho, phir upar YA neeche theek karo
fun deleteAt(a: MutableList<Int>, k: Int) {
    val last = a.removeAt(a.size - 1) // aakhri jagah khaali karo - shape complete rahe //@last
    if (k == a.size) return // aakhri hi hatana tha //@end
    a[k] = last // hole ko aakhri item se bharo //@put
    var i = k
    while (i > 0 && a[(i - 1) / 2] > a[i]) { // parent se chhota - upar chadho //@up
        Collections.swap(a, i, (i - 1) / 2)
        i = (i - 1) / 2
    }
    while (true) { // bachchon se bada - neeche jao (dono loop mein se ek hi kaam karega)
        val l = 2 * i + 1
        val r = l + 1
        var m = i
        if (l < a.size && a[l] < a[m]) m = l
        if (r < a.size && a[r] < a[m]) m = r
        if (m == i) break // parent <= ye <= bachche: jagah pakki //@stop
        Collections.swap(a, i, m) //@down
        i = m
    }
}

fun main() {
    val h = mutableListOf(1, 10, 2, 11, 12, 3, 4)
    deleteAt(h, 4) // 12 hatao; aakhri 4 wahan shape UPAR jaata hai
    println(h)
    deleteAt(h, 0) // root hatao = pop; aakhri 3 NEECHE jaata hai
    println(h)
}

// Output:
// [1, 4, 2, 11, 10, 3]
// [2, 4, 3, 11, 10]
