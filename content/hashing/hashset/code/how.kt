fun main() {
    val a = hashSetOf(1, 2, 3, 4)
    val b = hashSetOf(3, 4, 5)
    println(a.add(2)) // 2 pehle se hai -> add() false deta hai, kuch nahi badla //@add
    println(3 in a) // contains: O(1) average //@contains
    println(a.intersect(b).sorted()) // dono mein common //@intersect
    println((a union b).sorted()) // dono ke saare (bina duplicate) //@union
    println((a - b).sorted()) // sirf a mein, b mein nahi //@minus
}

// Output:
// false
// true
// [3, 4]
// [1, 2, 3, 4, 5]
// [1, 2]
