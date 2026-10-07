// dp[i] = s ke pehle i characters dictionary ke words mein poore toot sakte hain?
fun wordBreak(s: String, wordDict: List<String>): Boolean {
    val words = wordDict.toHashSet()
    val dp = BooleanArray(s.length + 1)
    dp[0] = true // khaali string - toot gayi (kuch nahi bacha)
    for (i in 1..s.length) {
        for (j in 0 until i) {
            if (dp[j] && s.substring(j, i) in words) { // pehle j theek + aakhri piece s[j..i) ek word
                dp[i] = true
                break
            }
        }
    }
    return dp[s.length]
}

fun main() {
    println(wordBreak("chaipani", listOf("chai", "pani", "pa", "ni")))
    println(wordBreak("chaipaniya", listOf("chai", "pani")))
}

// Output:
// true
// false
