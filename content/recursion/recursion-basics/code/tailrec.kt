// 1 + 2 + ... + n
// tailrec: recursive call function ka AAKHRI kaam hai, to Kotlin ise andar se loop bana deta hai
tailrec fun sumTo(n: Long, acc: Long = 0): Long {
    if (n == 0L) return acc
    return sumTo(n - 1, acc + n) // call ke baad kuch kaam baaki nahi
}

// Normal recursion: call ke BAAD '+ n' karna baaki hai, isliye har call ka frame stack par rukta hai
fun sumToPlain(n: Long): Long = if (n == 0L) 0 else n + sumToPlain(n - 1)

fun main() {
    println(sumTo(100_000)) // tailrec: stack nahi bharta
    println(sumToPlain(1000)) // chhota n: theek hai
    try {
        println(sumToPlain(1_000_000)) // 10 lakh frames: stack khatam
    } catch (e: StackOverflowError) {
        println("StackOverflowError")
    }
}

// Output:
// 5000050000
// 500500
// StackOverflowError
