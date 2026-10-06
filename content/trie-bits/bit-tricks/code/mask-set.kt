// Chhota set (elements 0..31) = ek Int. Set ke kaam = bit ops, sab O(1)
fun main() {
    var a = 0
    a = a or (1 shl 1) or (1 shl 3) // add 1 aur 3: {1, 3}
    val b = (1 shl 3) or (1 shl 4) // {3, 4}
    println(Integer.toBinaryString(a))
    println("${a or b} ${a and b} ${a and b.inv()}") // union {1,3,4}, common {3}, a - b {1}
    println(((a shr 3) and 1) == 1) // 3 set mein hai?
    println(Integer.bitCount(a or b)) // union ka size
    // mask ke saare sub-masks (subsets): sub = (sub - 1) and mask
    val mask = 11 // 1011
    var sub = mask
    val subs = ArrayList<Int>()
    while (sub > 0) {
        subs.add(sub)
        sub = (sub - 1) and mask
    }
    println(subs)
}

// Output:
// 1010
// 26 8 2
// true
// 3
// [11, 10, 9, 8, 3, 2, 1]
