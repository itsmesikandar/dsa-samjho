class ListNode(var value: Int, var next: ListNode? = null)

// 2 lists kahin jaakar ek ho jaati hain (Y shape). Milne wala pehla NODE do (na mile to null).
fun getIntersectionNode(a: ListNode?, b: ListNode?): ListNode? {
    var p = a
    var q = b
    while (p !== q) { // same NODE (same object) - sirf same value nahi //@step
        p = if (p == null) b else p.next // apni list khatam: doosri list ke head par jump kar jao //@switch
        q = if (q == null) a else q.next
    }
    return p // dono ne barabar raasta chala: milne ki jagah, ya dono null //@meet
}

fun build(vararg xs: Int, tail: ListNode? = null): ListNode? {
    var head = tail
    for (x in xs.reversed()) head = ListNode(x, head)
    return head
}

fun main() {
    val shared = build(8, 4, 5)
    val a = build(4, 1, tail = shared) // 4 -> 1 -> 8 -> 4 -> 5
    val b = build(5, 6, 1, tail = shared) // 5 -> 6 -> 1 -> 8 -> 4 -> 5
    println(getIntersectionNode(a, b)?.value)
    println(getIntersectionNode(build(2, 6, 4), build(1, 5))?.value) // kahin nahi mile
}

// Output:
// 8
// null
