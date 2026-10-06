// Trie: har node = ek prefix. 26 bachche (a-z) aur ek flag - kya koi word yahin khatam hota hai?
class TrieNode {
    val next = arrayOfNulls<TrieNode>(26)
    var isEnd = false
}

class Trie {
    private val root = TrieNode()

    fun insert(word: String) {
        var cur = root
        for (ch in word) {
            val k = ch - 'a'
            if (cur.next[k] == null) cur.next[k] = TrieNode() // ye prefix pehli baar - naya node //@create
            cur = cur.next[k]!!
        }
        cur.isEnd = true // poora word yahan khatam //@end
    }

    // s ke saare aksharon ka raasta - mila to aakhri node, warna null
    private fun walk(s: String): TrieNode? {
        var cur = root
        for (ch in s) {
            cur = cur.next[ch - 'a'] ?: return null // raasta toota - aisa prefix hai hi nahi //@step
        }
        return cur
    }

    fun search(word: String): Boolean = walk(word)?.isEnd == true // raasta bhi ho AUR word wahin khatam //@search

    fun startsWith(prefix: String): Boolean = walk(prefix) != null // sirf raasta kaafi //@prefix
}

fun main() {
    val t = Trie()
    for (w in listOf("app", "apple", "apt", "bat")) t.insert(w)
    println(t.search("ap"))
    println(t.startsWith("ap"))
    println(t.search("app"))
}

// Output:
// false
// true
// true
