// Bubble sort: padosiyon ko compare karo, galat order ho to swap.
// Har pass mein bacha hua sabse bada item end tak 'bubble' ho jaata hai.
fun bubbleSort(a: IntArray) {
    val n = a.size
    for (pass in 0 until n - 1) {
        var swapped = false
        for (j in 0 until n - 1 - pass) { // aakhri 'pass' items pehle se apni jagah par
            if (a[j] > a[j + 1]) {
                val t = a[j]
                a[j] = a[j + 1]
                a[j + 1] = t
                swapped = true
            }
        }
        if (!swapped) break // poore pass mein ek bhi swap nahi = sorted, ruk jao
    }
}

fun main() {
    val a = intArrayOf(5, 1, 4, 2, 8)
    bubbleSort(a)
    println(a.contentToString())
}

// Output:
// [1, 2, 4, 5, 8]
