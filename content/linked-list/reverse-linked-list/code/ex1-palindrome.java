class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    // List aage se aur peeche se same padhti hai? O(1) extra memory.
    static boolean isPalindrome(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { // slow beech tak //@middle
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverseList(slow); // doosra aadha ulta - ab peeche se padh sakte hain //@reverse
        ListNode first = head;
        while (second != null) {
            if (first.val != second.val) return false; //@compare
            first = first.next;
            second = second.next;
        }
        return true; //@yes
    }

    static ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        return prev;
    }

    static ListNode build(int... xs) {
        ListNode head = null;
        for (int i = xs.length - 1; i >= 0; i--) head = new ListNode(xs[i], head);
        return head;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome(build(1, 2, 2, 1)));
        System.out.println(isPalindrome(build(1, 2, 3, 2, 1)));
        System.out.println(isPalindrome(build(1, 2)));
    }
}

// Output:
// true
// true
// false
