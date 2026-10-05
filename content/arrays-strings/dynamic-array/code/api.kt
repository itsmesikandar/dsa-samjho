fun main() {
    // Pehle se capacity do (100) - baar-baar resize nahi hoga
    val list: MutableList<Int> = ArrayList(100)
    list.addAll(listOf(4, 1, 7, 1))

    println(list.indexOf(1)) // pehla match ka index - O(n)
    println(list.contains(7)) // poori list dekhni padti hai - O(n)

    list.remove(1) // Kotlin: VALUE 1 hatao (pehla wala)
    println(list)
    list.removeAt(0) // INDEX 0 hatao
    println(list)

    list.sort()
    println(list)

    val arr: IntArray = list.toIntArray() // List<Int> -> IntArray
    println(arr.sum())
}

// Output:
// 1
// true
// [4, 7, 1]
// [7, 1]
// [1, 7]
// 8
