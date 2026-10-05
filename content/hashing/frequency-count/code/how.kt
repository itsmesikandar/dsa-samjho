// Har lowercase letter kitni baar aaya? IntArray(26): index = c - 'a'
fun letterCounts(s: String): IntArray {
    val count = IntArray(26) // a..z ke liye 26 dabbe, sab 0 //@init
    for (c in s) {
        count[c - 'a']++ // 'a' -> 0, 'b' -> 1 ... seedha index, koi hashing nahi //@count
    }
    return count //@done
}

fun main() {
    val count = letterCounts("banana")
    // sirf jo letters aaye unhe print karo: letter + count
    println((0 until 26).filter { count[it] > 0 }.joinToString(" ") { "${'a' + it}${count[it]}" })
}

// Output:
// a3 b1 n2
