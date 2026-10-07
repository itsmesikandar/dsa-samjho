// Char array ko recursion se ulta karo (in-place)
fun reverse(s: CharArray, l: Int, r: Int) {
    if (l >= r) return // 0 ya 1 char bacha: kuch nahi karna //@base
    val t = s[l] // dono edge badlo //@swap
    s[l] = s[r]
    s[r] = t
    reverse(s, l + 1, r - 1) // andar wala hissa: wahi sawaal, 2 chhota //@call
}

fun main() {
    val s = "hello".toCharArray()
    reverse(s, 0, s.size - 1)
    println(String(s))
    val one = "a".toCharArray()
    reverse(one, 0, one.size - 1)
    println(String(one))
}

// Output:
// olleh
// a
