class Node {
    val next = arrayOfNulls<Node>(26)
    var isEnd = false
}

// Har word ko uske SABSE CHHOTE root se badlo (agar koi root uska prefix ho)
fun replaceWords(roots: List<String>, sentence: String): String {
    val root = Node()
    for (r in roots) { // saare roots trie mein
        var cur = root
        for (ch in r) {
            val k = ch - 'a'
            if (cur.next[k] == null) cur.next[k] = Node()
            cur = cur.next[k]!!
        }
        cur.isEnd = true
    }
    val out = ArrayList<String>()
    for (word in sentence.split(" ")) {
        var cur = root
        var res = word // koi root na mila to word waisa hi
        for (i in word.indices) {
            cur = cur.next[word[i] - 'a'] ?: break // raasta toota - koi root iska prefix nahi //@walk
            if (cur.isEnd) { // pehla hi root = sabse chhota, yahin ruko //@root
                res = word.substring(0, i + 1)
                break
            }
        }
        out.add(res)
    }
    return out.joinToString(" ")
}

fun main() {
    println(replaceWords(listOf("chai", "pan", "dal"), "chaiwala pani daliya"))
    println(replaceWords(listOf("a", "ab"), "abc xyz"))
}

// Output:
// chai pan dal
// a xyz
