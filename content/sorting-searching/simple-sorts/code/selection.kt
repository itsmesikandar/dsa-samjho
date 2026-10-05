// Selection sort: har pass mein bache hue hisse ka sabse chhota dhoondho, use aage rakh do
fun selectionSort(a: IntArray) {
    for (i in 0 until a.size - 1) {
        var min = i
        for (j in i + 1 until a.size) if (a[j] < a[min]) min = j // sabse chhota kahan hai?
        if (min != i) { // har pass mein zyada se zyada EK swap
            val t = a[i]
            a[i] = a[min]
            a[min] = t
        }
    }
}

fun main() {
    val a = intArrayOf(64, 25, 12, 22, 11)
    selectionSort(a)
    println(a.contentToString())
}

// Output:
// [11, 12, 22, 25, 64]
