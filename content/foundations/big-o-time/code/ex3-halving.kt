// n ko baar-baar aadha karo jab tak 1 na bache. Kitne steps?
fun halvings(n: Int): Int {
    var x = n
    var steps = 0
    while (x > 1) { // har round mein x aadha ho raha hai //@loop
        x /= 2 //@half
        steps++
    }
    return steps //@done
}

fun main() {
    println(halvings(64)) // 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
    println(halvings(1_000_000)) // 10 lakh: sirf 19 steps!
    println(halvings(1_000_000_000)) // 100 crore: sirf 29 steps
}

// Output:
// 6
// 19
// 29
