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

    // Aakhir se n-th node hatao - ek hi pass mein (length count kiye bina)
    static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head); // head hi hatana pade to bhi same code
        ListNode fast = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next; // fast ko n + 1 step aage: dono ke beech distance fix
        ListNode slow = dummy;
        while (fast != null) { // ab dono saath chalo; fast null par = slow hatane wale ke PICHHLE par
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
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
        System.out.println(show(removeNthFromEnd(build(1, 2, 3, 4, 5), 2)));
        System.out.println(show(removeNthFromEnd(build(1), 1)));
    }
}

// Output:
// 1 -> 2 -> 3 -> 5
// (khaali)
