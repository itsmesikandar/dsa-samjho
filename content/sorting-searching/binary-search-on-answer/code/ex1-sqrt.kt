// x ka square root, neeche ki taraf poora number (library sqrt ke bina)
fun mySqrt(x: Int): Int {
    var lo = 0
    var hi = x
    while (lo < hi) {
        val mid = lo + (hi - lo + 1) / 2 // UPAR round: hum 'aakhri TRUE' dhoondh rahe hain //@mid
        if (mid.toLong() * mid <= x) lo = mid // mid chal gaya: answer mid ya bada //@ok
        else hi = mid - 1 // mid ka square bada: answer chhota //@big
    }
    return lo //@done
}

fun main() {
    println(mySqrt(8))
    println(mySqrt(16))
    println(mySqrt(2147395599)) // mid * mid Int mein overflow karta - isliye Long
}

// Output:
// 2
// 4
// 46339
