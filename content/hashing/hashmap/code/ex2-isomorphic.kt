// s ke har char ko t ke ek char se badal sakte ho (ek-se-ek, dono taraf)?
fun isIsomorphic(s: String, t: String): Boolean {
    if (s.length != t.length) return false
    val st = HashMap<Char, Char>() // s ka char -> t ka char //@init
    val ts = HashMap<Char, Char>() // t ka char -> s ka char (ulta rishta)
    for (i in s.indices) {
        val a = s[i]
        val b = t[i]
        if (st.getOrPut(a) { b } != b) return false // a pehle kisi AUR se juda tha //@st
        if (ts.getOrPut(b) { a } != a) return false // b pehle kisi AUR se juda tha //@ts
    }
    return true //@done
}

fun main() {
    println(isIsomorphic("egg", "add"))
    println(isIsomorphic("foo", "bar"))
    println(isIsomorphic("badc", "baba")) // ek taraf theek, ulti taraf fail
}

// Output:
// true
// false
// false
