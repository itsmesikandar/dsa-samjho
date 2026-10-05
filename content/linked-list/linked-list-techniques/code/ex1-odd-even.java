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

    // Pehle saare odd POSITION wale nodes (1st, 3rd, ...), phir even position wale. Order same, O(1) memory.
    static ListNode oddEvenList(ListNode head) {
        if (head == null) return null;
        ListNode odd = head;
        ListNode evenHead = head.next; // even list ka shuru - aakhir mein odd list ke baad jodna hai
        ListNode even = evenHead;
        while (even != null && even.next != null) {
            odd.next = even.next; // agla odd = even ke theek baad wala //@odd
            odd = odd.next;
            even.next = odd.next; // agla even = naye odd ke baad wala //@even
            even = even.next;
        }
        odd.next = evenHead; // odd list ke end par poori even list //@join
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
        System.out.println(show(oddEvenList(build(1, 2, 3, 4, 5))));
        System.out.println(show(oddEvenList(build(2, 1, 3, 5, 6, 4, 7))));
    }
}

// Output:
// 1 -> 3 -> 5 -> 2 -> 4
// 2 -> 3 -> 6 -> 7 -> 1 -> 5 -> 4
