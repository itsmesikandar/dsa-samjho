class WNode {
    val next = arrayOfNulls<WNode>(26)
    var isEnd = false
}

// Words daalo; search mein '.' = koi bhi ek letter
class WordDictionary {
    private val root = WNode()

    fun addWord(word: String) {
        var cur = root
        for (ch in word) {
            val k = ch - 'a'
            if (cur.next[k] == null) cur.next[k] = WNode()
            cur = cur.next[k]!!
        }
        cur.isEnd = true
    }

    fun search(word: String): Boolean = dfs(root, word, 0)

    // i = pattern mein kahan tak, node = trie mein kahan
    private fun dfs(node: WNode, word: String, i: Int): Boolean {
        if (i == word.length) return node.isEnd // pattern khatam - word bhi yahin khatam hona chahiye //@end
        val ch = word[i]
        if (ch == '.') { // koi bhi letter - har bachche mein try karo //@dot
            for (child in node.next) {
                if (child != null && dfs(child, word, i + 1)) return true
            }
            return false
        }
        val child = node.next[ch - 'a'] ?: return false // is letter ka raasta hi nahi //@char
        return dfs(child, word, i + 1)
    }
}

fun main() {
    val d = WordDictionary()
    for (w in listOf("roti", "rota", "ram", "rasta")) d.addWord(w)
    println(d.search("r.t."))
    println(d.search("..m"))
    println(d.search("r.ti."))
}

// Output:
// true
// true
// false
