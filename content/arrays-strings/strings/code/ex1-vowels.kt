fun countVowels(s: String): Int {
    var count = 0
    for (c in s.lowercase()) { // 'A' aur 'a' dono gine jaayein
        if (c in "aeiou") count++ // vowel hai? //@check
    }
    return count //@done
}

fun main() {
    println(countVowels("Hello World"))
    println(countVowels("Chai Pe Charcha"))
}

// Output:
// 3
// 5
