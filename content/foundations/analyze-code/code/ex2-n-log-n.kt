// Bahar ka loop n baar; andar j har baar double -> log n baar. Total?
fun countOps(n: Int): Int {
    var ops = 0
    for (i in 0 until n) { // n baar //@outer
        var j = 1
        while (j < n) { // j = 1, 2, 4, 8... -> log n baar //@inner
            ops++
            j *= 2
        }
    }
    return ops // n x log n //@done
}

fun main() {
    println(countOps(8)) // 8 x 3
    println(countOps(1024)) // 1024 x 10
}

// Output:
// 24
// 10240
