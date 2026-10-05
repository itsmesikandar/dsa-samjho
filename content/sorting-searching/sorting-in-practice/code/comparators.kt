data class Person(val name: String, val age: Int)

fun main() {
    val people = listOf(Person("Ravi", 25), Person("Anu", 30), Person("Zoya", 25), Person("Babu", 30))
    // age ulta (bade pehle); age barabar ho to naam A-Z
    val sorted = people.sortedWith(compareByDescending<Person> { it.age }.thenBy { it.name })
    println(sorted.joinToString { "${it.name}(${it.age})" })

    val nums = intArrayOf(5, 2, 9, 1)
    nums.sort() // in-place; IntArray par andar dual-pivot quicksort
    println(nums.contentToString())
    println(nums.sortedDescending()) // nayi List, ulta order; asli array wahi
}

// Output:
// Anu(30), Babu(30), Ravi(25), Zoya(25)
// [1, 2, 5, 9]
// [9, 5, 2, 1]
