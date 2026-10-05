fun main() {
    val a = intArrayOf(10, 20, 30, 40) // sorted hona ZAROORI hai
    println(a.binarySearch(30)) // mila: index
    val r = a.binarySearch(25) // nahi mila: -(insertion point) - 1
    println(r)
    println(-(r + 1)) // insertion point: 25 ko kahan daalein ki sorted rahe
    val list = listOf(1, 3, 5)
    println(list.binarySearch(5)) // List par bhi
}

// Output:
// 2
// -3
// 2
// 2
