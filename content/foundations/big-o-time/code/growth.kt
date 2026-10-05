// log2(n): n ko kitni baar aadha karein ki 1 bache (integer wala, floor)
fun log2(n: Long): Long {
    var x = n
    var c = 0L
    while (x > 1) {
        x /= 2
        c++
    }
    return c
}

fun main() {
    val sizes = longArrayOf(10, 1_000, 100_000, 1_000_000)
    println("n | log n | n log n | n^2")
    for (n in sizes) {
        // Long use kiya, kyunki n^2 = 10^12 Int mein fit nahi hota
        println("$n | ${log2(n)} | ${n * log2(n)} | ${n * n}")
    }
}

// Output:
// n | log n | n log n | n^2
// 10 | 3 | 30 | 100
// 1000 | 9 | 9000 | 1000000
// 100000 | 16 | 1600000 | 10000000000
// 1000000 | 19 | 19000000 | 1000000000000
