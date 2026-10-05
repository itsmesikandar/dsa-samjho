// Har character kitni baar aaya? HashMap + getOrDefault
fun charFrequency(s: String): Map<Char, Int> {
    val freq = HashMap<Char, Int>() //@init
    for (c in s) {
        freq[c] = freq.getOrDefault(c, 0) + 1 // nahi hai to 0 maano, phir +1 //@count
    }
    return freq.toSortedMap() // HashMap ka order fix nahi hota; print ke liye sorted //@done
}

fun main() {
    println(charFrequency("banana"))
    println(charFrequency("chai"))
}

// Output:
// {a=3, b=1, n=2}
// {a=1, c=1, h=1, i=1}
