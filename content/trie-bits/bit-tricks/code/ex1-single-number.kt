// Ek number akela, baaki sab 2-2 baar. x xor x = 0, x xor 0 = x - jode kat jaate, akela bachta
fun singleNumber(nums: IntArray): Int {
    var r = 0
    for (x in nums) r = r xor x // order se farak nahi (XOR commutative) //@xor
    return r //@done
}

fun main() {
    println(singleNumber(intArrayOf(7, 3, 5, 3, 7)))
    println(singleNumber(intArrayOf(1)))
}

// Output:
// 5
// 1
