fun main() {
    val marks = hashMapOf("Ravi" to 72, "Anu" to 91, "Kabir" to 85)

    // HashMap ka order fixed nahi - fixed order chahiye to sorted map par loop
    for ((name, m) in marks.toSortedMap()) println("$name: $m")

    // sabse zyada marks kiske?
    val top = marks.maxByOrNull { it.value }!!.key
    println(top)

    // merge: key hai to purani value ke saath jodo, nahi hai to nayi daalo
    marks.merge("Ravi", 5, Int::plus)
    println(marks["Ravi"])
}

// Output:
// Anu: 91
// Kabir: 85
// Ravi: 72
// Anu
// 77
