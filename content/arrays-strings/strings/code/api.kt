fun main() {
    val s = "chai, samosa, jalebi"
    println(s.length) // characters ki count
    println(s[0]) // index se char - O(1)
    println(s.substring(6, 12)) // [6, 12) - NAYI string banti hai, O(k)
    println(s.indexOf("jalebi")) // pehla match - O(n * m) tak
    println(s.split(", ")) // pieces

    val chars = "dcba".toCharArray() // String -> CharArray (badal sakte ho)
    chars.sort()
    println(String(chars)) // CharArray -> String

    println('a'.code) // character ka number (Unicode/ASCII)
    println("Chai".equals("chai", ignoreCase = true))
    println("ab".repeat(3))
}

// Output:
// 20
// c
// samosa
// 14
// [chai, samosa, jalebi]
// abcd
// 97
// true
// ababab
