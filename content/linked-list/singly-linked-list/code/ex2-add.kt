class ListNode(var value: Int, var next: ListNode? = null)

// Do numbers ULTE digits mein (2 -> 4 -> 3 matlab 342). Jod ke usi format mein do.
fun addTwoNumbers(a: ListNode?, b: ListNode?): ListNode? {
    var p = a
    var q = b
    var carry = 0
    var head: ListNode? = null
    var tail: ListNode? = null
    while (p != null || q != null || carry != 0) { // carry bacha ho to bhi ek aur digit
        val sum = (p?.value ?: 0) + (q?.value ?: 0) + carry // chhoti list khatam: 0 maano //@sum
        carry = sum / 10
        val node = ListNode(sum % 10) // is jagah ka digit //@digit
        if (tail == null) head = node else tail.next = node
        tail = node
        p = p?.next
        q = q?.next
    }
    return head
}

fun build(vararg xs: Int): ListNode? {
    var head: ListNode? = null
    for (x in xs.reversed()) head = ListNode(x, head)
    return head
}

fun show(head: ListNode?): String {
    val parts = mutableListOf<String>()
    var cur = head
    while (cur != null) {
        parts.add(cur.value.toString())
        cur = cur.next
    }
    return if (parts.isEmpty()) "(khaali)" else parts.joinToString(" -> ")
}

fun main() {
    println(show(addTwoNumbers(build(2, 4, 3), build(5, 6, 4)))) // 342 + 465 = 807
    println(show(addTwoNumbers(build(9, 9, 9, 9), build(9, 9)))) // 9999 + 99 = 10098
}

// Output:
// 7 -> 0 -> 8
// 8 -> 9 -> 0 -> 0 -> 1
