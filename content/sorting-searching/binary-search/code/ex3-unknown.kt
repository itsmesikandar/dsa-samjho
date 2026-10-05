// Array ka size nahi pata. reader.get(i) bahar ke index par Int.MAX_VALUE deta hai.
class ArrayReader(private val a: IntArray) {
    fun get(i: Int): Int = if (i < a.size) a[i] else Int.MAX_VALUE
}

fun search(reader: ArrayReader, target: Int): Int {
    var hi = 1
    while (reader.get(hi) < target) hi *= 2 // range double karte jao jab tak target andar na aa jaaye //@grow
    var lo = hi / 2 // pichhli baar wala hi - usse pehle target ho hi nahi sakta
    while (lo <= hi) {
        val mid = lo + (hi - lo) / 2
        val v = reader.get(mid) //@mid
        when {
            v == target -> return mid //@found
            v < target -> lo = mid + 1 //@right
            else -> hi = mid - 1 // MAX_VALUE bhi yahan aata hai: bahar = 'bahut bada' //@left
        }
    }
    return -1 //@none
}

fun main() {
    val reader = ArrayReader(intArrayOf(-1, 0, 3, 5, 9, 12, 15, 20, 25, 31, 40))
    println(search(reader, 25))
    println(search(reader, 2))
}

// Output:
// 8
// -1
