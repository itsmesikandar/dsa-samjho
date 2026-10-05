fun main() {
    val list = mutableListOf(3, 7, 9) //@init
    list.add(5) // end mein daalna: O(1) amortized //@add
    list.add(0, 1) // shuru mein: baaki sab right khiske -> O(n) //@addfront
    list.removeAt(2) // beech se hatana: baad wale left khiske -> O(n) //@remove
    list[1] = 8 // index par update: O(1) //@set
    println(list)
    println(list.size)
}

// Output:
// [1, 8, 9, 5]
// 4
