// Stream ki pichhli 'size' values ka average - circular buffer (ring buffer) se
class MovingAverage(private val size: Int) {
    private val buf = IntArray(size)
    private var idx = 0 // agli value kahan likhni hai
    private var count = 0
    private var sum = 0L

    fun next(v: Int): Double {
        if (count == size) sum -= buf[idx] // sabse purani value overwrite hone wali hai: sum se hatao
        else count++
        buf[idx] = v
        sum += v
        idx = (idx + 1) % size // ghoom ke wapas shuru
        return sum.toDouble() / count
    }
}

fun main() {
    val m = MovingAverage(3)
    println(m.next(1))
    println(m.next(10))
    println(m.next(3))
    println(m.next(5)) // 1 gaya: (10 + 3 + 5) / 3
}

// Output:
// 1.0
// 5.5
// 4.666666666666667
// 6.0
