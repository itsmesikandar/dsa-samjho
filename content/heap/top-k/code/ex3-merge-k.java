import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    // Har list ka sabse aage wala node heap mein; sabse chhota nikaalo, usi list ka agla daalo
    static ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode h : lists) if (h != null) pq.add(h); // har list ka head (khaali list skip) //@init
        ListNode dummy = new ListNode(0, null);
        ListNode tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll(); // sab heads mein sabse chhota //@take
            tail.next = node; // result ke end par jodo
            tail = node;
            if (node.next != null) pq.add(node.next); // usi list ka agla node ab head //@next
        }
        return dummy.next; //@done
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
        System.out.println(show(mergeKLists(new ListNode[] {build(1, 4, 5), build(1, 3, 4), build(2, 6)})));
        System.out.println(show(mergeKLists(new ListNode[] {null, build(2, 5), null})));
        System.out.println(show(mergeKLists(new ListNode[] {})));
    }
}

// Output:
// 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
// 2 -> 5
// (khaali)
