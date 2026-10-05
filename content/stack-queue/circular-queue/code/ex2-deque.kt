// Fixed size ka circular DEQUE: aage aur peeche dono taraf jodo / nikaalo
class MyCircularDeque(k: Int) {
    private val a = IntArray(k)
    private var head = 0
    private var count = 0

    fun insertFront(x: Int): Boolean {
        if (isFull()) return false
        head = (head - 1 + a.size) % a.size // head ek PEECHE; 0 se pehle = aakhri index //@front
        a[head] = x
        count++
        return true
    }

    fun insertLast(x: Int): Boolean {
        if (isFull()) return false
        a[(head + count) % a.size] = x //@last
        count++
        return true
    }

    fun deleteFront(): Boolean {
        if (isEmpty()) return false
        head = (head + 1) % a.size //@delFront
        count--
        return true
    }

    fun deleteLast(): Boolean {
        if (isEmpty()) return false
        count-- // tail = head + count, to count ghata = aakhri apne aap gaya //@delLast
        return true
    }

    fun getFront() = if (isEmpty()) -1 else a[head]

    fun getRear() = if (isEmpty()) -1 else a[(head + count - 1) % a.size]

    fun isEmpty() = count == 0

    fun isFull() = count == a.size
}

fun main() {
    val d = MyCircularDeque(3)
    println(d.insertLast(1))
    println(d.insertLast(2))
    println(d.insertFront(3))
    println(d.insertFront(4)) // bhara hai
    println(d.getRear())
    println(d.isFull())
    println(d.deleteLast())
    println(d.insertFront(4))
    println(d.getFront())
}

// Output:
// true
// true
// true
// false
// 2
// true
// true
// true
// 4
