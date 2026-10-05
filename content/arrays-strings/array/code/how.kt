// Array mein beech mein (index par) naya value daalna.
// arr = poora array (capacity), size = abhi kitne dabbe bhare hain
fun insertAt(arr: IntArray, size: Int, index: Int, value: Int): Int {
    require(size < arr.size) { "Array full hai" } // jagah hi nahi to insert nahi //@check
    require(index in 0..size) { "Index 0..size ke beech hona chahiye" }
    var i = size - 1 // last bhare hue dabbe se shuru //@init
    while (i >= index) { // index tak peeche aate jao //@loop
        arr[i + 1] = arr[i] // har item ek kadam right copy //@shift
        i--
    }
    arr[index] = value // ab ye jagah khaali hai, value rakh do //@place
    return size + 1 // ek item badh gaya //@done
}

fun main() {
    // capacity 8, lekin abhi sirf 5 dabbe bhare hain
    val arr = intArrayOf(10, 20, 30, 40, 50, 0, 0, 0)
    var size = 5
    size = insertAt(arr, size, 2, 99)
    println(arr.copyOf(size).contentToString())
    println("size = $size")
}

// Output:
// [10, 20, 99, 30, 40, 50]
// size = 6
