import java.util.TreeSet

fun main() {
    val words = listOf("samosa", "chai", "jalebi", "chai", "samosa")

    // LinkedHashSet: duplicates hatao par PEHLI baar wala order rakho
    println(LinkedHashSet(words))

    // TreeSet: sorted order + "isse just bada/chhota" queries (O(log n))
    val ts = TreeSet(listOf(10, 40, 20, 50))
    println(ts)
    println(ts.ceiling(25)) // 25 ya usse bada sabse chhota
    println(ts.floor(25)) // 25 ya usse chhota sabse bada

    // Ek line mein unique count
    println(words.toSet().size)
}

// Output:
// [samosa, chai, jalebi]
// [10, 20, 40, 50]
// 40
// 20
// 3
