// Line mein i-th insaan ko tickets[i] tickets chahiye. Ek baar mein ek ticket (1 second), phir line ke peeche.
// k-th insaan ko apne saare tickets kab tak mil jaayenge?
fun timeRequiredToBuy(tickets: IntArray, k: Int): Int {
    val t = tickets.copyOf()
    var time = 0
    var i = 0
    while (true) {
        if (t[i] > 0) { // jinke tickets poore ho gaye wo line se bahar - skip
            t[i]--
            time++ //@buy
            if (i == k && t[i] == 0) return time //@done
        }
        i = (i + 1) % t.size // line ka aakhri ke baad wapas pehla: circular //@next
    }
}

fun main() {
    println(timeRequiredToBuy(intArrayOf(2, 3, 2), 2))
    println(timeRequiredToBuy(intArrayOf(5, 1, 1, 1), 0))
}

// Output:
// 6
// 8
