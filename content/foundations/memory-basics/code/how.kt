// Ek chhota function: iska frame call hone par stack par banega, return par hatega
fun square(x: Int): Int {
    val result = x * x // local variable: square ke frame mein //@calc
    return result // frame hatega, sirf value wapas jaayegi //@ret
}

fun main() {
    val n = 5 // primitive: seedha stack frame mein //@n
    val arr = intArrayOf(1, 2, 3) // object: heap par; stack mein sirf address //@arr
    val s = square(n) // naya frame stack ke upar //@call
    println(s) //@print
    println(arr.contentToString())
}

// Output:
// 25
// [1, 2, 3]
