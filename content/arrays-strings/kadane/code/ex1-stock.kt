// Ek din kharido, baad ke kisi din becho. Max profit? (fayda na ho to 0)
fun maxProfit(prices: IntArray): Int {
    var minPrice = prices[0] // ab tak ka sabse sasta din //@init
    var best = 0
    for (i in 1 until prices.size) {
        best = maxOf(best, prices[i] - minPrice) // aaj becho to kitna fayda? //@sell
        minPrice = minOf(minPrice, prices[i]) // aaj sasta hai? yaad rakho //@min
    }
    return best //@done
}

fun main() {
    println(maxProfit(intArrayOf(7, 1, 5, 3, 6, 4)))
    println(maxProfit(intArrayOf(7, 6, 4, 3, 1))) // daam girte hi rahe - na kharido
}

// Output:
// 5
// 0
