// Har insaan [height, k]: k = mere AAGE kitne log hain jinki height >= meri. Line dobara banao.
fun reconstructQueue(people: Array<IntArray>): List<IntArray> {
    // lambe log pehle; same height par chhota k pehle
    val sorted = people.sortedWith(compareByDescending<IntArray> { it[0] }.thenBy { it[1] }) //@sort
    val line = ArrayList<IntArray>()
    for (p in sorted) {
        // ab tak line mein sab mujhse lambe (ya barabar) hain -> mujhe thik index k par ghusna hai
        line.add(p[1], p) //@insert
    }
    return line
}

fun main() {
    val people = arrayOf(
        intArrayOf(7, 0), intArrayOf(4, 4), intArrayOf(7, 1),
        intArrayOf(5, 0), intArrayOf(6, 1), intArrayOf(5, 2),
    )
    println(reconstructQueue(people).joinToString(", ") { it.contentToString() })
}

// Output:
// [5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]
