// Browser ki back / forward history
class BrowserHistory(homepage: String) {
    private class Page(val url: String) {
        var prev: Page? = null
        var next: Page? = null
    }

    private var cur = Page(homepage)

    fun visit(url: String) {
        val p = Page(url)
        cur.next = p // naya page: aage ki purani history kat gayi //@visit
        p.prev = cur
        cur = p
    }

    fun back(steps: Int): String {
        var s = steps
        while (s > 0) {
            val p = cur.prev ?: break // isse peeche kuch nahi: ruk jao //@back
            cur = p
            s--
        }
        return cur.url
    }

    fun forward(steps: Int): String {
        var s = steps
        while (s > 0) {
            val n = cur.next ?: break //@forward
            cur = n
            s--
        }
        return cur.url
    }
}

fun main() {
    val b = BrowserHistory("leetcode.com")
    b.visit("google.com")
    b.visit("facebook.com")
    b.visit("youtube.com")
    println(b.back(1))
    println(b.back(1))
    println(b.forward(1))
    b.visit("linkedin.com") // youtube wali forward history ab gayab
    println(b.forward(2))
    println(b.back(2))
    println(b.back(7)) // jitna ho sake utna peeche
}

// Output:
// facebook.com
// google.com
// facebook.com
// linkedin.com
// google.com
// leetcode.com
