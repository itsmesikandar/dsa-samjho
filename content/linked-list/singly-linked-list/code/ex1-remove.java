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

    // List se saare x wale nodes hata do
    static ListNode removeElements(ListNode head, int x) {
        while (head != null && head.val == x) head = head.next; // aage ke saare x hatao: head hi badal jaata hai //@head
        ListNode cur = head;
        while (cur != null) {
            ListNode nxt = cur.next;
            if (nxt != null && nxt.val == x) {
                cur.next = nxt.next; // nxt ko beech se nikaalo: uske aage wale se jod do //@skip
            } else {
                cur = nxt; // hataya nahi tabhi aage badho (continuous x ho sakte hain) //@move
            }
        }
        return head;
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
        System.out.println(show(removeElements(build(1, 2, 6, 3, 4, 5, 6), 6)));
        System.out.println(show(removeElements(build(7, 7, 7, 7), 7)));
    }
}

// Output:
// 1 -> 2 -> 3 -> 4 -> 5
// (khaali)
