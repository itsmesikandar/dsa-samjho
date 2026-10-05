// Load factor 0.75 cross hote hi capacity double aur saari keys dobara daalo (rehash)
fun main() {
    var capacity = 4
    var buckets = Array(capacity) { mutableListOf<Int>() }
    var size = 0
    for (k in intArrayOf(5, 9, 13, 2, 6)) {
        buckets[k % capacity].add(k) //@insert
        size++
        if (size > 0.75 * capacity) { // bahut bhar gaya - chains lambi hongi //@check
            val old = buckets
            capacity *= 2
            buckets = Array(capacity) { mutableListOf<Int>() }
            for (list in old) {
                for (x in list) buckets[x % capacity].add(x) // har key ki NAYI jagah (capacity badli!) //@rehash
            }
        }
    }
    println("capacity = $capacity")
    println(buckets.joinToString(" "))
}

// Output:
// capacity = 8
// [] [9] [2] [] [] [5, 13] [6] []
