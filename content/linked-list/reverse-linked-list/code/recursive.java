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

    // Recursion se ulta: "baaki list ulti ho gayi" maan lo, phir apna ek arrow theek karo
    static ListNode reverseRec(ListNode head) {
        if (head == null || head.next == null) return head; // 0 ya 1 node: ulta = wahi
        ListNode nxt = head.next;
        ListNode newHead = reverseRec(nxt); // nxt se aage sab ulta (bharosa); newHead = purana aakhri node
        nxt.next = head; // mera agla ab mujhe point kare
        head.next = null; // main ab aakhri hoon
        return newHead;
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
        System.out.println(show(reverseRec(build(1, 2, 3, 4))));
    }
}

// Output:
// 4 -> 3 -> 2 -> 1
