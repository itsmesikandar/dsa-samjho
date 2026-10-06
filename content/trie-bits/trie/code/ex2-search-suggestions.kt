class SNode {
    val next = arrayOfNulls<SNode>(26)
    val top = ArrayList<String>() // is prefix wale pehle 3 products (sorted order mein daale, to yahi sabse chhote)
}

// Har typed prefix par max 3 suggestions - lexicographically sabse chhote
fun suggestedProducts(products: Array<String>, searchWord: String): List<List<String>> {
    val root = SNode()
    for (p in products.sorted()) { // SORTED daalo - har node par pehle aane wale hi chhote //@insert
        var cur = root
        for (ch in p) {
            val k = ch - 'a'
            if (cur.next[k] == null) cur.next[k] = SNode()
            cur = cur.next[k]!!
            if (cur.top.size < 3) cur.top.add(p)
        }
    }
    val ans = ArrayList<List<String>>()
    var cur: SNode? = root
    for (ch in searchWord) {
        cur = cur?.next?.get(ch - 'a') // raasta toota to aage sab khaali //@type
        ans.add(cur?.top ?: emptyList())
    }
    return ans //@done
}

fun main() {
    println(suggestedProducts(arrayOf("pani", "paneer", "papad", "pakoda", "paratha"), "pani"))
    println(suggestedProducts(arrayOf("chai"), "cx"))
}

// Output:
// [[pakoda, paneer, pani], [pakoda, paneer, pani], [paneer, pani], [pani]]
// [[chai], []]
