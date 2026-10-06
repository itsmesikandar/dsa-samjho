// Har node par do ginti: pass = kitne words is prefix se guzre, ends = kitne yahin khatam
class CNode {
    val next = arrayOfNulls<CNode>(26)
    var pass = 0
    var ends = 0
}

class CountTrie {
    private val root = CNode()

    fun insert(word: String) {
        var cur = root
        cur.pass++ // khaali prefix "" se har word guzarta hai
        for (ch in word) {
            val k = ch - 'a'
            if (cur.next[k] == null) cur.next[k] = CNode()
            cur = cur.next[k]!!
            cur.pass++
        }
        cur.ends++
    }

    // maan ke chalo word trie mein hai - raaste ki har ginti ek kam
    fun erase(word: String) {
        var cur = root
        cur.pass--
        for (ch in word) {
            cur = cur.next[ch - 'a']!!
            cur.pass--
        }
        cur.ends--
    }

    private fun find(s: String): CNode? {
        var cur = root
        for (ch in s) cur = cur.next[ch - 'a'] ?: return null
        return cur
    }

    fun countWordsEqualTo(word: String): Int = find(word)?.ends ?: 0

    fun countWordsStartingWith(prefix: String): Int = find(prefix)?.pass ?: 0
}

fun main() {
    val t = CountTrie()
    for (w in listOf("chai", "chai", "chawal", "chana")) t.insert(w)
    println(t.countWordsEqualTo("chai"))
    println(t.countWordsStartingWith("cha"))
    t.erase("chai")
    println(t.countWordsStartingWith("chai"))
}

// Output:
// 2
// 4
// 1
