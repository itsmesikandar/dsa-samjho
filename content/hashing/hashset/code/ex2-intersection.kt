// Dono arrays mein common numbers (har ek sirf ek baar), sorted
fun intersection(a: IntArray, b: IntArray): IntArray {
    val setA = a.toHashSet() // a ke numbers yaad rakho, O(1) check ke liye //@build
    val res = HashSet<Int>() // result bhi set - duplicate apne aap hatenge
    for (x in b) {
        if (x in setA) res.add(x) // b ka x a mein bhi hai? //@check
    }
    return res.sorted().toIntArray() //@done
}

fun main() {
    println(intersection(intArrayOf(4, 9, 5), intArrayOf(9, 4, 9, 8, 4)).contentToString())
    println(intersection(intArrayOf(1, 2, 2, 1), intArrayOf(2, 2)).contentToString())
}

// Output:
// [4, 9]
// [2]
