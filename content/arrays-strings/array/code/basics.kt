fun main() {
    // 1) Array banana: 5 dabbe, sab 0 se bhare
    val marks = IntArray(5)
    // 2) Values ke saath seedha banana
    val prices = intArrayOf(40, 10, 70, 20)

    // 3) Index se likhna aur padhna - dono O(1)
    marks[0] = 95
    marks[3] = 78
    println(prices[2])      // index 2 = teesra item
    println(marks.size)     // size fixed hai, baad mein badal nahi sakti

    // 4) Har element ek baar dekhna (traverse) - O(n)
    var total = 0
    for (p in prices) total += p
    println(total)

    // index bhi chahiye to indices use karo
    for (i in prices.indices) {
        if (prices[i] > 30) println("index $i par ${prices[i]}")
    }

    // 5) Poora array print: contentToString(), warna [I@1b6d3586 jaisa kuch aayega
    println(marks.contentToString())
}

// Output:
// 70
// 5
// 140
// index 0 par 40
// index 2 par 70
// [95, 0, 0, 78, 0]
