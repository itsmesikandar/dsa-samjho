fun main() {
    val n = 16

    var a = 0
    for (i in 0 until n) a++ // i++ -> O(n)

    var b = 0
    var i = 1
    while (i < n) { // i *= 2 -> O(log n)
        b++
        i *= 2
    }

    var c = 0
    for (x in 0 until n) for (y in 0 until n) c++ // n x n -> O(n^2)

    var d = 0
    for (x in 0 until n) for (y in x + 1 until n) d++ // n(n-1)/2 -> phir bhi O(n^2)

    var e = 0
    var k = 1
    while (k * k <= n) { // k^2 <= n -> O(sqrt n)
        e++
        k++
    }

    println("n: $a, log n: $b, n^2: $c, n(n-1)/2: $d, sqrt n: $e")
}

// Output:
// n: 16, log n: 4, n^2: 256, n(n-1)/2: 120, sqrt n: 4
