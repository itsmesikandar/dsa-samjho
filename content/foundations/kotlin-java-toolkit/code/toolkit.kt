data class Student(val name: String, val marks: Int)

fun main() {
    // List (dynamic array): size badal sakti hai
    val list = mutableListOf(5, 2, 8)
    list.add(1)
    list.sort()
    println(list)

    // Comparator: marks zyada wala pehle; marks barabar ho to naam A-Z
    val students = listOf(Student("Ravi", 80), Student("Anu", 92), Student("Kabir", 80))
    val sorted = students.sortedWith(compareByDescending<Student> { it.marks }.thenBy { it.name })
    println(sorted.map { it.name })

    // HashSet: duplicate apne aap hat jaate hain
    val seen = hashSetOf(3, 1, 3)
    println(seen.size)

    // HashMap: getOrDefault se count
    val count = HashMap<String, Int>()
    for (w in listOf("chai", "samosa", "chai")) count[w] = count.getOrDefault(w, 0) + 1
    println(count["chai"])

    // Char ka hisaab: 'a' -> 0, 'b' -> 1 ... (array index ke liye bahut kaam ka)
    val sb = StringBuilder()
    for (c in "abc") sb.append(c - 'a')
    println(sb)
    println('a' + 2) // c

    // Int ki limit aur Long
    println(Int.MAX_VALUE.toLong() + 1)
}

// Output:
// [1, 2, 5, 8]
// [Anu, Kabir, Ravi]
// 2
// 2
// 012
// c
// 2147483648
