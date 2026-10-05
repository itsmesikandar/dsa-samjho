class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    // List ka beech wala node (do beech ho to doosra wala)
    static ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head; //@init
        while (fast != null && fast.next != null) { // fast do kadam le sake tab tak
            slow = slow.next; // slow: 1 kadam //@step
            fast = fast.next.next; // fast: 2 kadam
        }
        return slow; // fast end par pahuncha = slow aadhe raaste par //@done
    }

    static ListNode build(int... xs) {
        ListNode head = null;
        for (int i = xs.length - 1; i >= 0; i--) head = new ListNode(xs[i], head);
        return head;
    }

    public static void main(String[] args) {
        System.out.println(middleNode(build(1, 2, 3, 4, 5)).val);
        System.out.println(middleNode(build(1, 2, 3, 4, 5, 6)).val);
    }
}

// Output:
// 3
// 4
