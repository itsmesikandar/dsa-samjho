// Har letter sirf ek tukde mein: tukda tab tak khiincho jab tak andar ke saare letters ka AAKHRI index na aa jaaye
fun partitionLabels(s: String): List<Int> {
    val last = IntArray(26)
    for (i in s.indices) last[s[i] - 'a'] = i // har letter aakhri baar kahan //@last
    val sizes = mutableListOf<Int>()
    var start = 0
    var end = 0
    for (i in s.indices) {
        end = maxOf(end, last[s[i] - 'a']) // ye letter hai to tukda kam se kam yahan tak //@extend
        if (i == end) { // tukde ke saare letters ka aakhri aa gaya - yahin kaato //@cut
            sizes.add(end - start + 1)
            start = i + 1
        }
    }
    return sizes
}

fun main() {
    println(partitionLabels("abacdcdeffe"))
    println(partitionLabels("zz"))
    println(partitionLabels("abc"))
}

// Output:
// [3, 4, 4]
// [2]
// [1, 1, 1]
