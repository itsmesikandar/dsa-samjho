// 0..n har number mein kitne 1 bits. i shr 1 = i ke bits bina aakhri bit ke - uska jawab pehle se pata (DP)
fun countBits(n: Int): IntArray {
    val ans = IntArray(n + 1) // ans[0] = 0
    for (i in 1..n) {
        ans[i] = ans[i shr 1] + (i and 1) // aadhe wale ke 1s + aakhri bit //@step
    }
    return ans //@done
}

fun main() {
    println(countBits(8).contentToString())
    println(countBits(0).contentToString())
}

// Output:
// [0, 1, 1, 2, 1, 2, 2, 3, 1]
// [0]
