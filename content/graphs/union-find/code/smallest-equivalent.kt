// s1[i] aur s2[i] barabar maane jaate hain. Har group ka leader = sabse chhota letter
fun find(parent: IntArray, x: Int): Int {
    if (parent[x] != x) parent[x] = find(parent, parent[x])
    return parent[x]
}

fun smallestEquivalent(s1: String, s2: String, base: String): String {
    val parent = IntArray(26) { it } // 26 letters, har ek apna group
    for (i in s1.indices) {
        val a = find(parent, s1[i] - 'a')
        val b = find(parent, s2[i] - 'a')
        if (a < b) parent[b] = a else parent[a] = b // chhota letter hi leader bane
    }
    return base.map { 'a' + find(parent, it - 'a') }.joinToString("")
}

fun main() {
    println(smallestEquivalent("abc", "cde", "eed"))
    println(smallestEquivalent("hello", "world", "hold"))
}

// Output:
// aab
// hdld
