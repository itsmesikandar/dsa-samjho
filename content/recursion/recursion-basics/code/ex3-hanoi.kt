// n disks ko 'from' se 'to' par le jao, 'via' ki madad se. Bada disk kabhi chhote ke upar nahi.
fun hanoi(n: Int, from: Char, to: Char, via: Char, moves: MutableList<String>) {
    if (n == 0) return // koi disk nahi: kuch nahi karna //@base
    hanoi(n - 1, from, via, to, moves) // 1. upar ke n-1 disks raaste se hatao (via par) //@top
    moves.add("disk $n: $from -> $to") // 2. sabse bada disk seedha 'to' par //@move
    hanoi(n - 1, via, to, from, moves) // 3. n-1 disks wapas bade ke upar //@back
}

fun main() {
    val moves = mutableListOf<String>()
    hanoi(3, 'A', 'C', 'B', moves)
    println(moves.size) // 2^3 - 1
    moves.forEach { println(it) }
}

// Output:
// 7
// disk 1: A -> C
// disk 2: A -> B
// disk 1: C -> B
// disk 3: A -> C
// disk 1: B -> A
// disk 2: B -> C
// disk 1: A -> C
