// Senators R aur D baari-baari bolte hain. Har ek kisi doosri party wale ka haq chheen sakta hai. Kaun jeetega?
fun predictPartyVictory(senate: String): String {
    val n = senate.length
    val r = ArrayDeque<Int>() // R senators ki baari (index = kab bolega)
    val d = ArrayDeque<Int>()
    senate.forEachIndexed { i, c -> if (c == 'R') r.addLast(i) else d.addLast(i) }
    while (r.isNotEmpty() && d.isNotEmpty()) {
        val ri = r.removeFirst() // dono parties ke agle senator aamne-saamne //@face
        val di = d.removeFirst()
        if (ri < di) {
            r.addLast(ri + n) // R pehle bola: D ka haq gaya; R agle round mein phir aayega //@rwin
        } else {
            d.addLast(di + n) //@dwin
        }
    }
    return if (r.isNotEmpty()) "Radiant" else "Dire"
}

fun main() {
    println(predictPartyVictory("RDD"))
    println(predictPartyVictory("RD"))
}

// Output:
// Dire
// Radiant
