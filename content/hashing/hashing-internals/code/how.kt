// Apna chhota HashMap: buckets ka array, har bucket mein ek list (chaining)
class MyHashMap(private val capacity: Int = 5) {
    private val buckets = Array(capacity) { mutableListOf<Pair<Int, String>>() }

    // key -> bucket number (negative key ke liye bhi sahi)
    private fun indexOf(key: Int) = Math.floorMod(key, capacity) //@hash

    fun put(key: Int, value: String) {
        val bucket = buckets[indexOf(key)]
        for (i in bucket.indices) {
            if (bucket[i].first == key) { // key pehle se hai: sirf value badlo //@update
                bucket[i] = Pair(key, value)
                return
            }
        }
        bucket.add(Pair(key, value)) // nayi key: bucket ki list mein jodo (chaining) //@add
    }

    fun get(key: Int): String? {
        for ((k, v) in buckets[indexOf(key)]) { // sirf EK bucket dekho, poora map nahi //@scan
            if (k == key) return v
        }
        return null // is bucket mein nahi = map mein hi nahi //@miss
    }
}

fun main() {
    val m = MyHashMap(5)
    m.put(12, "chai")
    m.put(7, "samosa") // 7 % 5 = 2, 12 % 5 = 2 -> collision!
    m.put(9, "pakoda")
    m.put(17, "jalebi") // ye bhi bucket 2
    m.put(12, "coffee") // update
    println(m.get(17))
    println(m.get(12))
    println(m.get(3))
}

// Output:
// jalebi
// coffee
// null
