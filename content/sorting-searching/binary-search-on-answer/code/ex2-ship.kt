// Packets ka order fix. Roz ek ship, capacity C. 'days' din mein sab bhejne ke liye sabse kam C?
fun shipWithinDays(weights: IntArray, days: Int): Int {
    var lo = weights.max() // sabse bhaari packet to jaana hi hai
    var hi = weights.sum() // ek hi din mein sab //@init
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2 //@mid
        if (daysNeeded(weights, mid) <= days) hi = mid // ye capacity chal gayi: aur kam try karo //@ok
        else lo = mid + 1 //@notok
    }
    return lo //@done
}

// Capacity cap ho to kitne din lagenge? Greedy: aaj jitna aa sake bharo
fun daysNeeded(w: IntArray, cap: Int): Int {
    var d = 1
    var load = 0
    for (x in w) {
        if (load + x > cap) { // aaj jagah nahi: kal ki ship
            d++
            load = 0
        }
        load += x
    }
    return d
}

fun main() {
    println(shipWithinDays(intArrayOf(3, 2, 2, 4, 1, 4), 3))
    println(shipWithinDays(intArrayOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 5))
}

// Output:
// 6
// 15
