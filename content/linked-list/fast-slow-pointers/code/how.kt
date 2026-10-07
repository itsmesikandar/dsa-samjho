class ListNode(var value: Int, var next: ListNode? = null)

// List ka beech wala node (do beech ho to doosra wala)
fun middleNode(head: ListNode?): ListNode? {
    var slow = head
    var fast = head //@init
    while (fast != null && fast.next != null) { // fast do step le sake tab tak
        slow = slow?.next // slow: 1 step //@step
        fast = fast.next?.next // fast: 2 step
    }
    return slow // fast end par pahuncha = slow aadhe raaste par //@done
}

fun build(vararg xs: Int): ListNode? {
    var head: ListNode? = null
    for (x in xs.reversed()) head = ListNode(x, head)
    return head
}

fun main() {
    println(middleNode(build(1, 2, 3, 4, 5))?.value)
    println(middleNode(build(1, 2, 3, 4, 5, 6))?.value)
}

// Output:
// 3
// 4
