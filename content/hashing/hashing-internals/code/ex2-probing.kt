// Open addressing (linear probing): collision ho to AGLA khaali dabba dhoondho
fun insertAll(keys: IntArray, m: Int): Array<Int?> {
    require(keys.size <= m) { "Table mein jagah kam hai" }
    val table = arrayOfNulls<Int>(m)
    for (k in keys) {
        var i = Math.floorMod(k, m) // pehli pasand //@hash
        while (table[i] != null) {
            i = (i + 1) % m // bhara hai? agla dabba (end ke baad wapas 0) //@probe
        }
        table[i] = k //@place
    }
    return table
}

fun main() {
    println(insertAll(intArrayOf(18, 41, 22, 44, 59, 32, 31, 73), 11).contentToString())
}

// Output:
// [22, 44, 73, null, 59, null, null, 18, 41, 31, 32]
