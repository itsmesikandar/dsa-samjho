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

    // k-k nodes ke pieces ulte karo; aakhir mein k se kam bache to waise hi chhodo
    static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrev = dummy; // pichhle (ulte ho chuke) pieces ka aakhri node
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next; // aage poore k nodes hain? //@check
            if (kth == null) break; // k se kam bache: chhod do
            ListNode groupNext = kth.next; // agle pieces ka pehla
            ListNode prev = groupNext; // ulta piece seedha agle pieces se jude, isliye prev yahan se
            ListNode cur = groupPrev.next;
            while (cur != groupNext) { // pieces ke arrows ulte //@flip
                ListNode nxt = cur.next;
                cur.next = prev;
                prev = cur;
                cur = nxt;
            }
            ListNode oldFirst = groupPrev.next; // ulte hone ke baad ye pieces ka aakhri hai
            groupPrev.next = kth; // pichhla piece ab is pieces ke naye pehle (purane k-th) se jude //@join
            groupPrev = oldFirst;
        }
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
        System.out.println(show(reverseKGroup(build(1, 2, 3, 4, 5), 2)));
        System.out.println(show(reverseKGroup(build(1, 2, 3, 4, 5), 3)));
    }
}

// Output:
// 2 -> 1 -> 4 -> 3 -> 5
// 3 -> 2 -> 1 -> 4 -> 5
