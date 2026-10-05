// s, t ka subsequence hai? (s ke characters t mein usi order mein, beech mein gap chalega)
fun isSubsequence(s: String, t: String): Boolean {
    var i = 0 // s mein kahan tak match hua
    for (c in t) { // t par ek pointer, s par doosra - dono aage hi badhte hain
        if (i < s.length && s[i] == c) i++ // s ka agla char mil gaya
    }
    return i == s.length // s ke saare chars mile?
}

fun main() {
    println(isSubsequence("ace", "abcde"))
    println(isSubsequence("aec", "abcde")) // order galat
}

// Output:
// true
// false
