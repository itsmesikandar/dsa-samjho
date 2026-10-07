// 3 approaches, ek hi sawaal: kya koi number 2 baar hai?

// 3) HashSet: O(n) time, O(n) space (final choice jab n bada ho)
fun hasDupSet(arr: IntArray): Boolean {
    val seen = HashSet<Int>() //@init
    for (x in arr) {
        if (x in seen) return true // pehle dekha hua! //@hit
        seen.add(x) // yaad rakho //@add
    }
    return false //@none
}

// 1) Brute force: O(n^2) time, O(1) space
fun hasDupBrute(arr: IntArray): Boolean {
    for (i in arr.indices) for (j in i + 1 until arr.size) if (arr[i] == arr[j]) return true
    return false
}

// 2) Sort + neighbor check: O(n log n) time (copy banayi, isliye O(n) space)
fun hasDupSort(arr: IntArray): Boolean {
    val s = arr.sortedArray()
    for (i in 1 until s.size) if (s[i] == s[i - 1]) return true
    return false
}

fun main() {
    val a = intArrayOf(3, 1, 4, 1, 5)
    println(hasDupSet(a))
    println(hasDupBrute(a))
    println(hasDupSort(a))
    println(hasDupSet(intArrayOf(2, 7, 9)))
}

// Output:
// true
// true
// true
// false
