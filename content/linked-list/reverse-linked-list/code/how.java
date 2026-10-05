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

    // Linked list ulti karo (in-place): har arrow ek-ek karke ulta
    static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head; //@init
        while (cur != null) {
            ListNode nxt = cur.next; // aage ka raasta bachao - arrow ulta karte hi kho jaata //@save
            cur.next = prev; // arrow ulta: ab peeche wale ko //@flip
            prev = cur; // dono ek kadam aage //@move
            cur = nxt;
        }
        return prev; // cur null = sab ho gaya; prev = purana aakhri = naya head //@done
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
        System.out.println(show(reverseList(build(1, 2, 3, 4, 5))));
        System.out.println(show(reverseList(null)));
    }
}

// Output:
// 5 -> 4 -> 3 -> 2 -> 1
// (khaali)
