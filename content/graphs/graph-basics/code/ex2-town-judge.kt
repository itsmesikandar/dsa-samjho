// Judge: kisi par trust nahi karta (out = 0), baaki sab us par karte hain (in = n - 1)
fun findJudge(n: Int, trust: Array<IntArray>): Int {
    val score = IntArray(n + 1) // har insaan ka (in - out); log 1..n //@init
    for ((a, b) in trust) {
        score[a]-- // a ne kisi par trust kiya - a judge nahi ho sakta //@out
        score[b]++ // b par ek aur trust //@in
    }
    for (p in 1..n) {
        if (score[p] == n - 1) return p // n - 1 tabhi jab in = n - 1 aur out = 0 //@check
    }
    return -1 // koi judge nahi //@none
}

fun main() {
    println(findJudge(4, arrayOf(intArrayOf(1, 3), intArrayOf(2, 3), intArrayOf(4, 3))))
    println(findJudge(3, arrayOf(intArrayOf(1, 3), intArrayOf(2, 3), intArrayOf(3, 1))))
    println(findJudge(1, arrayOf()))
}

// Output:
// 3
// -1
// 1
