// Second largest (alag value). Na mile to -1.
// Brute force: sort karke peeche se dekho -> O(n log n). Better: ek hi pass -> O(n).
fun secondLargest(arr: IntArray): Int {
    var first = Int.MIN_VALUE // abhi tak ka sabse bada //@init
    var second = Int.MIN_VALUE // abhi tak ka doosra sabse bada
    for (x in arr) { //@loop
        if (x > first) { // naya champion: purana champion ab second //@new-first
            second = first
            first = x
        } else if (x > second && x != first) { // champion se chhota, par second se bada //@new-second
            second = x
        }
    }
    return if (second == Int.MIN_VALUE) -1 else second //@done
}

fun main() {
    println(secondLargest(intArrayOf(12, 35, 1, 10, 34, 1)))
    println(secondLargest(intArrayOf(7, 7, 7))) // edge case: sab same
    println(secondLargest(intArrayOf(5, 9))) // edge case: sirf do
}

// Output:
// 34
// -1
// 5
