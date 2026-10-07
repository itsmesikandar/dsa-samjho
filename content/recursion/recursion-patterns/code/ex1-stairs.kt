// n stairs, ek baar mein 1 ya 2 chadh sakte ho. Upar pahunchne ke kitne tareeke?
fun climbStairs(n: Int): Int = ways(n, HashMap())

fun ways(n: Int, memo: HashMap<Int, Int>): Int {
    if (n <= 1) return 1 // 0 ya 1 seedhi: ek hi tareeka //@base
    memo[n]?.let { return it } // pehle nikaal chuke? seedha wahi do //@memo
    val r = ways(n - 1, memo) + ways(n - 2, memo) // aakhri step 1 tha ya 2 //@calc
    memo[n] = r // yaad rakho, dobara kaam aayega //@save
    return r
}

fun main() {
    println(climbStairs(5))
    println(climbStairs(45)) // bina memo ke ye minute lagata; memo se turant
}

// Output:
// 8
// 1836311903
