// Numbers ko aise line mein jodo ki sabse bada number bane (answer String mein)
fun largestNumber(nums: IntArray): String {
    val s = nums.map { it.toString() }
    // a pehle ya b? Dono order jod ke dekho: "a+b" bada ho to a pehle
    val sorted = s.sortedWith { a, b -> (b + a).compareTo(a + b) } //@sort
    if (sorted[0] == "0") return "0" // sab zero: "000" nahi, "0" //@zero
    return sorted.joinToString("") //@join
}

fun main() {
    println(largestNumber(intArrayOf(3, 30, 34, 5, 9)))
    println(largestNumber(intArrayOf(0, 0)))
}

// Output:
// 9534330
// 0
