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

    // L0 -> L1 -> ... -> Ln ko L0 -> Ln -> L1 -> Ln-1 -> ... banao (in-place, values nahi badalni)
    static void reorderList(ListNode head) {
        if (head == null) return;
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { // 1. beech dhoondho //@middle
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverse(slow.next); // 2. doosra aadha ulta (Ln, Ln-1, ...) //@reverse
        slow.next = null; // pehla aadha alag
        ListNode first = head;
        while (second != null) { // 3. baari-baari: ek pehle se, ek doosre se //@weave
            ListNode n1 = first.next, n2 = second.next;
            first.next = second;
            second.next = n1;
            first = n1;
            second = n2;
        }
    }

    static ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        return prev;
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
        ListNode a = build(1, 2, 3, 4, 5);
        reorderList(a);
        System.out.println(show(a));
        ListNode b = build(1, 2, 3, 4);
        reorderList(b);
        System.out.println(show(b));
    }
}

// Output:
// 1 -> 5 -> 2 -> 4 -> 3
// 1 -> 4 -> 2 -> 3
