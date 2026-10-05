// Har baar line ke shuru ya end se ek card uthao, total k cards. Zyada se zyada points?
fun maxScore(cards: IntArray, k: Int): Int {
    val n = cards.size
    val total = cards.sum()
    val w = n - k // jo cards BACHENGE, wo hamesha beech ka lagatar hissa hain
    var sum = 0
    for (i in 0 until w) sum += cards[i] // pehla 'bacha hua' hissa //@first
    var minSum = sum
    for (r in w until n) {
        sum += cards[r] - cards[r - w] // size w ki window aage khiski //@slide
        minSum = minOf(minSum, sum) // bache hue ka sum jitna kam, utha hua utna zyada //@best
    }
    return total - minSum
}

fun main() {
    println(maxScore(intArrayOf(1, 2, 3, 4, 5, 6, 1), 3))
    println(maxScore(intArrayOf(9, 7, 7, 9, 7, 7, 9), 7)) // saare uthaye: w = 0
}

// Output:
// 12
// 55
