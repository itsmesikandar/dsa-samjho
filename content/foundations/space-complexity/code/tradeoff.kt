// Sawaal: array mein koi number do baar hai? Do tareeke.

// 1) O(n^2) time, O(1) extra space: har pair compare
fun hasDupSlow(arr: IntArray): Boolean {
    for (i in arr.indices) {
        for (j in i + 1 until arr.size) {
            if (arr[i] == arr[j]) return true
        }
    }
    return false
}

// 2) O(n) time, O(n) extra space: HashSet "yaad" rakhta hai kya dekh liya
fun hasDupFast(arr: IntArray): Boolean {
    val seen = HashSet<Int>()
    for (x in arr) {
        if (!seen.add(x)) return true // add() false deta hai agar pehle se tha
    }
    return false
}

fun main() {
    val a = intArrayOf(4, 7, 1, 7)
    println(hasDupSlow(a))
    println(hasDupFast(a))
    val b = intArrayOf(1, 2, 3)
    println(hasDupSlow(b))
    println(hasDupFast(b))
}

// Output:
// true
// true
// false
// false
