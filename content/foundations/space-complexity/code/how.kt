// Har element ka square ek NAYI array mein (input ko nahi chhuna)
fun squares(arr: IntArray): IntArray {
    val result = IntArray(arr.size) // n naye dabbe -> O(n) extra //@alloc
    for (i in arr.indices) { // i: sirf 1 dabba -> O(1)
        result[i] = arr[i] * arr[i] //@fill
    }
    return result //@done
}

fun main() {
    println(squares(intArrayOf(3, 1, 4)).contentToString())
}

// Output:
// [9, 1, 16]
