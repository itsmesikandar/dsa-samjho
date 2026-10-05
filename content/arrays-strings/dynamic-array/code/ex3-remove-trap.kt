// GALAT: aage badhte hue removeAt -> agla item khisak ke i par aa jaata hai, aur i++ use skip kar deta hai
fun removeEvensWrong(list: MutableList<Int>) {
    var i = 0
    while (i < list.size) {
        if (list[i] % 2 == 0) list.removeAt(i) //@remove
        i++ // remove ke baad bhi i++ -> naya list[i] kabhi check nahi hua! //@inc
    }
}

// SAHI: peeche se chalo - hatane se aage wale items par asar nahi padta
fun removeEvensRight(list: MutableList<Int>) {
    for (i in list.indices.reversed()) {
        if (list[i] % 2 == 0) list.removeAt(i) //@back
    }
}

fun main() {
    val a = mutableListOf(1, 2, 4, 5, 6, 8)
    removeEvensWrong(a)
    println(a) // 4 aur 8 bach gaye - bug!
    val b = mutableListOf(1, 2, 4, 5, 6, 8)
    removeEvensRight(b)
    println(b)
}

// Output:
// [1, 4, 5, 8]
// [1, 5]
