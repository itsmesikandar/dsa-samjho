// LCS ki length hi nahi, string bhi: pehle table bharo, phir (m, n) se peeche chalo
fun lcsString(a: String, b: String): String {
    val m = a.length
    val n = b.length
    val dp = Array(m + 1) { IntArray(n + 1) }
    for (i in 1..m) {
        for (j in 1..n) {
            dp[i][j] = if (a[i - 1] == b[j - 1]) dp[i - 1][j - 1] + 1 else maxOf(dp[i - 1][j], dp[i][j - 1])
        }
    }
    val sb = StringBuilder()
    var i = m
    var j = n
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) { // match - ye char LCS ka hai, tirchha jao
            sb.append(a[i - 1])
            i--
            j--
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i-- // jawab upar se aaya tha
        } else {
            j-- // baayein se aaya tha
        }
    }
    return sb.reverse().toString() // peeche se banaya - ulta karo
}

fun main() {
    println(lcsString("khana", "kahani"))
    println(lcsString("pakoda", "pakora"))
}

// Output:
// khan
// pakoa
