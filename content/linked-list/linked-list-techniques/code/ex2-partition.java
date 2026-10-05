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

    // x se chhote sab pehle, baaki baad mein; dono hisson ka andar ka order wahi rahe
    static ListNode partition(ListNode head, int x) {
        ListNode lessDummy = new ListNode(0, null); // do alag lists banao, dono ka nakli shuru
        ListNode moreDummy = new ListNode(0, null);
        ListNode less = lessDummy, more = moreDummy;
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (cur.val < x) { // chhota: 'less' list ke end mein //@less
                less.next = cur;
                less = cur;
            } else { // bada ya barabar: 'more' list ke end mein //@more
                more.next = cur;
                more = cur;
            }
        }
        more.next = null; // aakhri node ka purana next kaato - warna circle ban sakta hai //@cut
        less.next = moreDummy.next; // chhoton ke baad bade //@join
        return lessDummy.next;
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
        System.out.println(show(partition(build(1, 4, 3, 2, 5, 2), 3)));
        System.out.println(show(partition(build(2, 1), 2)));
    }
}

// Output:
// 1 -> 2 -> 2 -> 4 -> 3 -> 5
// 1 -> 2
