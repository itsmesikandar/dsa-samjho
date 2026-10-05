fun main() {
    val a = intArrayOf(1, 2)
    val b = intArrayOf(1, 2) // same values, par heap par ALAG object
    val c = a // naya object nahi, sirf a ka address copy

    println(a === b) // === matlab "same object?" -> nahi
    println(a === c) // c aur a ek hi object -> haan
    println(a.contentEquals(b)) // andar ke values same? -> haan

    val s1 = "chai"
    val s2 = StringBuilder("ch").append("ai").toString() // runtime pe bana naya String object
    println(s1 == s2) // Kotlin ka == values compare karta hai (equals)
    println(s1 === s2) // alag objects
}

// Output:
// false
// true
// true
// true
// false
