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

    // Do sorted lists ko ek sorted list mein jodo (naye nodes nahi - wahi nodes re-link)
    static ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null); // nakli shuruaat: "pehla node kaun" wala special case khatam
        ListNode tail = dummy; // result ka aakhri node //@init
        ListNode p = a, q = b;
        while (p != null && q != null) {
            if (p.val <= q.val) { // chhota jodo; barabar par pehli list wala (stable) //@pick
                tail.next = p;
                p = p.next;
            } else {
                tail.next = q;
                q = q.next;
            }
            tail = tail.next;
        }
        tail.next = (p != null) ? p : q; // jo list bachi, poori jod do - wo pehle se sorted hai //@rest
        return dummy.next; // asli head = dummy ke baad wala //@done
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
        System.out.println(show(mergeTwoLists(build(1, 2, 4), build(1, 3, 4))));
        System.out.println(show(mergeTwoLists(build(), build(0))));
    }
}

// Output:
// 1 -> 1 -> 2 -> 3 -> 4 -> 4
// 0
