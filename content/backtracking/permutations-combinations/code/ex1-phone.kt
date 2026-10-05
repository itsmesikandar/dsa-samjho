// Purane phone ka keypad: har digit (2-9) ke kuch letters. Digits ke saare possible letter combinations.
fun letterCombinations(digits: String): List<String> {
    if (digits.isEmpty()) return emptyList()
    val keys = arrayOf("", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz")
    val res = mutableListOf<String>()
    val sb = StringBuilder()
    fun bt(i: Int) {
        if (i == digits.length) { // har digit ka ek letter chun liya //@found
            res.add(sb.toString())
            return
        }
        for (ch in keys[digits[i] - '0']) { // is digit ke har letter ka ek raasta
            sb.append(ch) //@choose
            bt(i + 1)
            sb.deleteCharAt(sb.length - 1) //@unchoose
        }
    }
    bt(0)
    return res
}

fun main() {
    println(letterCombinations("23"))
    println(letterCombinations(""))
}

// Output:
// [ad, ae, af, bd, be, bf, cd, ce, cf]
// []
