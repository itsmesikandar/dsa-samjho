class ListNode(var value: Int, var next: ListNode? = null)

// List aage se aur peeche se same padhti hai? O(1) extra memory.
fun isPalindrome(head: ListNode?): Boolean {
    var slow = head
    var fast = head
    while (fast != null && fast.next != null) { // slow beech tak //@middle
        slow = slow?.next
        fast = fast.next?.next
    }
    var second = reverseList(slow) // doosra aadha ulta - ab peeche se padh sakte hain //@reverse
    var first = head
    while (second != null) {
        if (first?.value != second.value) return false //@compare
        first = first?.next
        second = second.next
    }
    return true //@yes
}

fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var cur = head
    while (cur != null) {
        val nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    }
    return prev
}

fun build(vararg xs: Int): ListNode? {
    var head: ListNode? = null
    for (x in xs.reversed()) head = ListNode(x, head)
    return head
}

fun main() {
    println(isPalindrome(build(1, 2, 2, 1)))
    println(isPalindrome(build(1, 2, 3, 2, 1)))
    println(isPalindrome(build(1, 2)))
}

// Output:
// true
// true
// false
