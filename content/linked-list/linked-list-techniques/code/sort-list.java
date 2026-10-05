import java.util.ArrayList;
import java.util.List;

class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    // Linked list ka merge sort: beech se todo (fast/slow), dono sort (recursion), merge (dummy)
    static ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next; // fast ek aage se: slow PEHLE beech par rukega (2 nodes bhi do mein tootein)
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode right = slow.next;
        slow.next = null; // list do hisson mein kaat di
        return merge(sortList(head), sortList(right));
    }

    static ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) {
                tail.next = a;
                a = a.next;
            } else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }

    static ListNode build(int... xs) {
        ListNode head = null;
        for (int i = xs.length - 1; i >= 0; i--) head = new ListNode(xs[i], head);
        return head;
    }

    static String show(ListNode head) {
        List<String> parts = new ArrayList<>();
        for (ListNode cur = head; cur != null; cur = cur.next) parts.add(String.valueOf(cur.val));
        return parts.isEmpty() ? "(khaali)" : String.join(" -> ", parts);
    }

    public static void main(String[] args) {
        System.out.println(show(sortList(build(4, 2, 1, 3))));
        System.out.println(show(sortList(build(-1, 5, 3, 4, 0))));
    }
}

// Output:
// 1 -> 2 -> 3 -> 4
// -1 -> 0 -> 3 -> 4 -> 5
