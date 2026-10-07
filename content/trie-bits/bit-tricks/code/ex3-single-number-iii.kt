// 2 number akele (a, b), baaki sab 2-2 baar. Sabka XOR = a xor b. Uska koi 1 bit = a aur b wahan alag - us bit se 2 groups
fun singleNumberIII(nums: IntArray): IntArray {
    var all = 0
    for (x in nums) all = all xor x // jode kate - bacha a xor b //@all
    val diff = all and -all // sabse right ka 1 bit: a aur b isi par alag //@bit
    var a = 0
    var b = 0
    for (x in nums) {
        if ((x and diff) != 0) a = a xor x else b = b xor x // jode ek hi group mein jaate, kat jaate //@split
    }
    return intArrayOf(a, b) //@done
}

fun main() {
    println(singleNumberIII(intArrayOf(6, 4, 9, 6, 4, 2)).sorted())
    println(singleNumberIII(intArrayOf(0, 1)).sorted())
}

// Output:
// [2, 9]
// [0, 1]
