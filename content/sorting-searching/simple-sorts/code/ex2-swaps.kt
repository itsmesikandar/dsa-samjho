// Sirf neighbors ko swap karke sort karna hai. Kam se kam kitne swaps lagenge?
// (Jawab = inversions: aise jode i < j jahan a[i] > a[j])
fun countSwaps(arr: IntArray): Int {
    val a = arr.copyOf()
    var swaps = 0
    for (pass in 0 until a.size - 1) {
        for (j in 0 until a.size - 1 - pass) {
            if (a[j] > a[j + 1]) { // galat order wale neighbor //@compare
                val t = a[j] // har aisa swap thik EK inversion khatam karta hai //@swap
                a[j] = a[j + 1]
                a[j + 1] = t
                swaps++
            }
        }
    }
    return swaps
}

fun main() {
    println(countSwaps(intArrayOf(2, 4, 1, 3, 5)))
    println(countSwaps(intArrayOf(5, 4, 3, 2, 1))) // ulta array: n(n-1)/2
}

// Output:
// 3
// 10
