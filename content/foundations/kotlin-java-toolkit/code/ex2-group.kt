// Words ko pehle letter ke hisaab se group karo. HashMap<Char, MutableList<String>>
fun groupByFirst(words: List<String>): Map<Char, List<String>> {
    val groups = HashMap<Char, MutableList<String>>() //@init
    for (w in words) {
        // list nahi hai to nayi banao (getOrPut), phir usme word daalo
        groups.getOrPut(w[0]) { mutableListOf() }.add(w) //@add
    }
    return groups.toSortedMap() //@done
}

fun main() {
    println(groupByFirst(listOf("chai", "samosa", "jalebi", "chutney", "jam")))
}

// Output:
// {c=[chai, chutney], j=[jalebi, jam], s=[samosa]}
