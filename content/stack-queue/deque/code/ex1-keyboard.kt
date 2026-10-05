// Kharab keyboard: har char type hota hai, par 'i' dabate hi ab tak ka text ULTA ho jaata hai ('i' khud nahi likhta)
fun finalString(s: String): String {
    val dq = ArrayDeque<Char>()
    var flipped = false // sach mein ulta karne (O(n)) ki jagah bas yaad rakho ki "ab ulta hai"
    for (c in s) {
        if (c == 'i') flipped = !flipped //@flip
        else if (flipped) dq.addFirst(c) // ulti halat mein naya char asal mein AAGE judta hai //@front
        else dq.addLast(c) //@back
    }
    val out = dq.joinToString("")
    return if (flipped) out.reversed() else out // aakhir mein ek hi baar seedha karo //@done
}

fun main() {
    println(finalString("string"))
    println(finalString("poiinter"))
}

// Output:
// rtsng
// ponter
