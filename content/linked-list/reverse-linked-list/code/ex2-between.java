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

    // Sirf position left se right tak (1 se count) wala piece ulta karo, ek pass mein
    static ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head); // left = 1 ho tab bhi 'pehle wala' node mile
        ListNode before = dummy;
        for (int i = 1; i < left; i++) before = before.next; // pieces se theek pehle wala node //@walk
        ListNode start = before.next; // pieces ka pehla - ulta hone ke baad aakhri banega
        ListNode prev = null, cur = start;
        for (int i = left; i <= right; i++) { // sirf pieces ke arrows ulte //@flip
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        before.next = prev; // pehle wala ab pieces ke naye shuru ko pakde //@join
        start.next = cur; // purana shuru (ab aakhri) baaki list ko pakde
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
        System.out.println(show(reverseBetween(build(1, 2, 3, 4, 5), 2, 4)));
        System.out.println(show(reverseBetween(build(3, 5), 1, 2)));
    }
}

// Output:
// 1 -> 4 -> 3 -> 2 -> 5
// 5 -> 3
