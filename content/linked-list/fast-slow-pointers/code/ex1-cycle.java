class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val) {
            this.val = val;
        }
    }

    // List mein circle (cycle) hai? O(1) extra memory.
    static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next; //@step
            fast = fast.next.next;
            if (slow == fast) return true; // tez wala peeche se aa ke mil gaya: circle hai //@meet
        }
        return false; // fast ko end (null) mil gaya: circle nahi //@end
    }

    // values se list; aakhri node index pos par wapas jude (pos = -1: koi circle nahi)
    static ListNode buildCycle(int[] values, int pos) {
        ListNode[] nodes = new ListNode[values.length];
        for (int i = 0; i < values.length; i++) nodes[i] = new ListNode(values[i]);
        for (int i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
        if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
        return nodes.length == 0 ? null : nodes[0];
    }

    public static void main(String[] args) {
        System.out.println(hasCycle(buildCycle(new int[]{3, 2, 0, -4}, 1)));
        System.out.println(hasCycle(buildCycle(new int[]{1, 2}, -1)));
    }
}

// Output:
// true
// false
