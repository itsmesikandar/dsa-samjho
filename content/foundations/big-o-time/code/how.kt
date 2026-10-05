// Array ka sum: loop har item par ek baar chalta hai -> n items = n steps
fun sum(arr: IntArray): Long {
    var total = 0L // ek baar ka kaam //@init
    for (x in arr) { // n baar chalega //@loop
        total += x // har item par ek kaam //@add
    }
    return total // ek baar ka kaam //@done
}

fun main() {
    println(sum(intArrayOf(4, 1, 3, 2))) // 4 items -> loop 4 baar
    println(sum(IntArray(1_000_000) { 1 })) // 10 lakh items -> loop 10 lakh baar
}

// Output:
// 10
// 1000000
