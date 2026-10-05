// Anagrams ko ek group mein rakho. Key = letters sort karke (anagrams ka sorted roop same hota hai)
fun groupAnagrams(words: List<String>): List<List<String>> {
    val groups = HashMap<String, MutableList<String>>() //@init
    for (w in words) {
        val key = String(w.toCharArray().apply { sort() }) // "eat" -> "aet", "tea" -> "aet" //@key
        groups.getOrPut(key) { mutableListOf() }.add(w) //@add
    }
    // print ke liye order fix: har group sorted, groups apne pehle word se sorted
    return groups.values.map { it.sorted() }.sortedBy { it.first() } //@done
}

fun main() {
    println(groupAnagrams(listOf("eat", "tea", "tan", "ate", "nat", "bat")))
}

// Output:
// [[ate, eat, tea], [bat], [nat, tan]]
