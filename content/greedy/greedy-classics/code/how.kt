// Ek baar khareedo, ek baar becho: har din socho "aaj bechein to ab tak ke SABSE SASTE din se kitna?"
fun maxProfit(prices: IntArray): Int {
    var minPrice = Int.MAX_VALUE // ab tak ka sabse sasta din //@init
    var best = 0
    for (p in prices) {
        if (p < minPrice) {
            minPrice = p // aur sasta din - khareedne ke liye isse better koi pichhla din nahi //@min
        } else {
            best = maxOf(best, p - minPrice) // aaj bechein to profit //@sell
        }
    }
    return best //@done
}

fun main() {
    println(maxProfit(intArrayOf(7, 2, 5, 1, 6, 4)))
    println(maxProfit(intArrayOf(5, 4, 3)))
}

// Output:
// 5
// 0
