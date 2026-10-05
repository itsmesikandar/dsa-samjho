// Dynamic array (ArrayList) jaisa: bhar jaaye to capacity double, saare items copy
fun main() {
    var capacity = 1
    var size = 0
    var copies = 0
    val n = 1000
    repeat(n) {
        if (size == capacity) { // bhar gaya
            copies += size // purane saare items nayi array mein copy
            capacity *= 2
        }
        size++ // naya item daala
    }
    // 1000 pushes mein copies sirf ~1000 -> har push par average ~1 copy = amortized O(1)
    println("pushes = $n, total copies = $copies, capacity = $capacity")
}

// Output:
// pushes = 1000, total copies = 1023, capacity = 1024
