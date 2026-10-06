import java.util.Collections
import java.util.PriorityQueue

// Locked: capital par min-heap (sabse sasta pehle khulta hai). Ready: profit par max-heap (sabse kamau pehle)
fun findMaximizedCapital(k: Int, w: Int, profits: IntArray, capital: IntArray): Int {
    val locked = PriorityQueue<Int>(compareBy { capital[it] }) // project index //@init
    val ready = PriorityQueue<Int>(Collections.reverseOrder()) // afford hone wale projects ke profit
    for (i in profits.indices) locked.add(i)
    var money = w
    for (round in 1..k) {
        while (locked.isNotEmpty() && capital[locked.peek()] <= money) { // paisa kaafi - project khul gaya //@unlock
            ready.add(profits[locked.poll()])
        }
        if (ready.isEmpty()) break // kuch afford nahi - paisa badhega hi nahi, ruko //@stuck
        money += ready.poll() // khule hue mein sabse zyada profit wala karo //@pick
    }
    return money //@done
}

fun main() {
    println(findMaximizedCapital(3, 1, intArrayOf(3, 5, 2, 7, 1), intArrayOf(0, 2, 1, 6, 3)))
    println(findMaximizedCapital(2, 0, intArrayOf(5, 4), intArrayOf(1, 2)))
    println(findMaximizedCapital(5, 0, intArrayOf(1, 2, 3), intArrayOf(0, 1, 1)))
}

// Output:
// 16
// 0
// 6
