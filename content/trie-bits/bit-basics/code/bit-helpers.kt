// Roz ke bit kaam - sab O(1). i = bit number (0 = sabse right)
fun isOdd(x: Int) = (x and 1) == 1 // aakhri bit 1 = odd (negative par bhi sahi, x % 2 nahi)
fun getBit(x: Int, i: Int) = (x shr i) and 1 // bit i: 0 ya 1
fun setBit(x: Int, i: Int) = x or (1 shl i) // bit i ko 1 karo
fun clearBit(x: Int, i: Int) = x and (1 shl i).inv() // bit i ko 0 karo
fun toggleBit(x: Int, i: Int) = x xor (1 shl i) // bit i ulta karo
fun lowestSetBit(x: Int) = x and -x // sirf sabse right wala 1 bacha, baaki 0

fun main() {
    val x = 13 // 1101
    println("${isOdd(x)} ${getBit(x, 1)} ${getBit(x, 2)}")
    println("${setBit(x, 1)} ${clearBit(x, 0)} ${toggleBit(x, 3)}") // 1111, 1100, 0101
    println(lowestSetBit(12)) // 1100 -> 100
    println("${isOdd(-3)} ${-3 % 2}") // % negative par -1 deta hai - isliye x % 2 == 1 galat
}

// Output:
// true 0 1
// 15 12 5
// 4
// true -1
