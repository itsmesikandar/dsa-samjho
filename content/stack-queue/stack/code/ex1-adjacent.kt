// Paas-paas ke do same letters hatao - baar-baar, jab tak koi aisa jodi na bache
fun removeDuplicates(s: String): String {
    val st = StringBuilder() // StringBuilder hi stack hai: end = top
    for (c in s) {
        if (st.isNotEmpty() && st.last() == c) { // top par same letter: dono gaye //@pop
            st.deleteCharAt(st.length - 1)
        } else {
            st.append(c) //@push
        }
    }
    return st.toString()
}

fun main() {
    println(removeDuplicates("abbaca"))
    println(removeDuplicates("azxxzy"))
}

// Output:
// ca
// ay
