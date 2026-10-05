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

    // pos (0 se) par naya node daalo; (shayad naya) head return karo
    static ListNode insertAt(ListNode head, int pos, int value) {
        ListNode node = new ListNode(value, null);
        if (pos == 0) { // sabse aage: naya node hi head ban jaata hai //@head
            node.next = head;
            return node;
        }
        ListNode prev = head;
        for (int i = 0; i < pos - 1 && prev != null; i++) prev = prev.next; // pos se ek PEHLE wale node tak chalo - O(pos) //@walk
        if (prev == null) return head; // pos list se bahar: kuch mat karo
        node.next = prev.next; // 1. naya node aage wale ko pakde //@link1
        prev.next = node; // 2. phir pichhla naya node ko pakde (ulta kiya to aage ki list kho jaayegi) //@link2
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
        ListNode head = build(10, 20, 40);
        head = insertAt(head, 2, 30);
        System.out.println(show(head));
        head = insertAt(head, 0, 5);
        System.out.println(show(head));
    }
}

// Output:
// 10 -> 20 -> 30 -> 40
// 5 -> 10 -> 20 -> 30 -> 40
