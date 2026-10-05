const val MOD = 1_000_000_007L // bahut questions answer "% (10^9 + 7)" maangte hain

// n! % MOD: har step par % lagao, taaki number kabhi bahut bada na ho
fun factMod(n: Int): Long {
    var result = 1L //@init
    for (i in 2..n) {
        result = (result * i) % MOD // Long mein multiply, phir turant % //@mul
    }
    return result //@done
}

// GALAT tareeka: Int mein seedha multiply -> overflow, chupchaap galat answer
fun factIntWrong(n: Int): Int {
    var r = 1
    for (i in 2..n) r *= i
    return r
}

fun main() {
    println(factMod(13))
    println(factIntWrong(13)) // galat! asli 13! = 6227020800
    var real = 1L
    for (i in 2..13) real *= i
    println(real)
    println(factMod(20))
}

// Output:
// 227020758
// 1932053504
// 6227020800
// 146326063
