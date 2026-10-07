class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val) {
            this.val = val;
        }
    }

    // Circle kis node se shuru hota hai? Na ho to null. O(1) memory.
    static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next; //@step
            fast = fast.next.next;
            if (slow == fast) { // mile: circle pakka hai
                ListNode p = head; // ek pointer head par wapas //@restart
                while (p != slow) { // dono 1-1 step: circle ki shuruaat par milenge (maths neeche) //@walk
                    p = p.next;
                    slow = slow.next;
                }
                return p; //@start
            }
        }
        return null; //@none
    }

    static ListNode buildCycle(int[] values, int pos) {
        ListNode[] nodes = new ListNode[values.length];
        for (int i = 0; i < values.length; i++) nodes[i] = new ListNode(values[i]);
        for (int i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
        if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
        return nodes.length == 0 ? null : nodes[0];
    }

    static String valueOf(ListNode n) {
        return n == null ? "null" : String.valueOf(n.val);
    }

    public static void main(String[] args) {
        System.out.println(valueOf(detectCycle(buildCycle(new int[]{3, 2, 0, -4}, 1))));
        System.out.println(valueOf(detectCycle(buildCycle(new int[]{1, 2}, 0))));
        System.out.println(valueOf(detectCycle(buildCycle(new int[]{1}, -1))));
    }
}

// Output:
// 2
// 1
// null
