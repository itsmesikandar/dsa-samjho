// index wala item hatao; uske baad ke saare items ek step left shift honge
fun deleteAt(arr: IntArray, size: Int, index: Int): Int {
    require(index in 0 until size) { "Index 0..size-1 ke beech hona chahiye" }
    for (i in index until size - 1) {
        arr[i] = arr[i + 1] // right wala item left mein aaya, gap bhar gaya
    }
    arr[size - 1] = 0 // last dabba ab khaali (safai ke liye)
    return size - 1
}

fun main() {
    val arr = intArrayOf(10, 20, 30, 40, 50)
    var size = 5
    size = deleteAt(arr, size, 1) // 20 hatao
    println(arr.copyOf(size).contentToString())
    println("size = $size")
}

// Output:
// [10, 30, 40, 50]
// size = 4
