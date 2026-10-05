// Do hisson wala function: pehle ek loop, phir nested loop. Total kaam kitna?
fun analyze(arr: IntArray): Int {
    var count = 0
    for (x in arr) count++ // hissa 1: n baar //@p1
    for (i in arr.indices) { // hissa 2: bahar n baar...
        for (j in arr.indices) count++ // ...andar bhi n baar = n x n //@p2
    }
    return count // n + n^2 //@done
}

fun main() {
    println(analyze(IntArray(4))) // 4 + 16
    println(analyze(IntArray(100))) // 100 + 10000
}

// Output:
// 20
// 10100
