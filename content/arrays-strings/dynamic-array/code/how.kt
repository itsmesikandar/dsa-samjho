// Apna chhota ArrayList: andar ek IntArray, bhar jaaye to double size ka naya array
class MyIntList {
    private var data = IntArray(2) // shuru mein chhoti capacity
    var size = 0 // kitne items sach mein bhare hain
        private set

    fun add(x: Int) {
        if (size == data.size) grow() // bhar gaya? pehle bada karo //@check
        data[size] = x // pehli khaali jagah par rakho //@put
        size++
    }

    private fun grow() {
        val bigger = IntArray(data.size * 2) // double capacity ka naya array //@alloc
        for (i in 0 until size) bigger[i] = data[i] // purane items ek-ek karke copy //@copy
        data = bigger // ab naya array hi hamara array //@swap
    }

    operator fun get(i: Int): Int {
        if (i !in 0 until size) throw IndexOutOfBoundsException("index $i, size $size")
        return data[i]
    }

    fun capacity() = data.size
}

fun main() {
    val list = MyIntList()
    for (x in listOf(10, 20, 30, 40, 50)) list.add(x)
    println("size = ${list.size}, capacity = ${list.capacity()}")
    println(list[4])
}

// Output:
// size = 5, capacity = 8
// 50
