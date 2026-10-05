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

    // Do numbers ULTE digits mein (2 -> 4 -> 3 matlab 342). Jod ke usi format mein do.
    static ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode p = a, q = b, head = null, tail = null;
        int carry = 0;
        while (p != null || q != null || carry != 0) { // carry bacha ho to bhi ek aur digit
            int sum = (p == null ? 0 : p.val) + (q == null ? 0 : q.val) + carry; // chhoti list khatam: 0 maano //@sum
            carry = sum / 10;
            ListNode node = new ListNode(sum % 10, null); // is jagah ka digit //@digit
            if (tail == null) head = node;
            else tail.next = node;
            tail = node;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
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
        System.out.println(show(addTwoNumbers(build(2, 4, 3), build(5, 6, 4)))); // 342 + 465 = 807
        System.out.println(show(addTwoNumbers(build(9, 9, 9, 9), build(9, 9)))); // 9999 + 99 = 10098
    }
}

// Output:
// 7 -> 0 -> 8
// 8 -> 9 -> 0 -> 0 -> 1
