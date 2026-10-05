class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    // Do lists kahin jaakar ek ho jaati hain (Y shape). Milne wala pehla NODE do (na mile to null).
    static ListNode getIntersectionNode(ListNode a, ListNode b) {
        ListNode p = a, q = b;
        while (p != q) { // same NODE (same object) - sirf same value nahi //@step
            p = (p == null) ? b : p.next; // apni list khatam: doosri list ke head par kood jao //@switch
            q = (q == null) ? a : q.next;
        }
        return p; // dono ne barabar raasta chala: milne ki jagah, ya dono null //@meet
    }

    static ListNode build(ListNode tail, int... xs) {
        ListNode head = tail;
        for (int i = xs.length - 1; i >= 0; i--) head = new ListNode(xs[i], head);
        return head;
    }

    static String valueOf(ListNode node) {
        return node == null ? "null" : String.valueOf(node.val);
    }

    public static void main(String[] args) {
        ListNode shared = build(null, 8, 4, 5);
        ListNode a = build(shared, 4, 1); // 4 -> 1 -> 8 -> 4 -> 5
        ListNode b = build(shared, 5, 6, 1); // 5 -> 6 -> 1 -> 8 -> 4 -> 5
        System.out.println(valueOf(getIntersectionNode(a, b)));
        System.out.println(valueOf(getIntersectionNode(build(null, 2, 6, 4), build(null, 1, 5)))); // kahin nahi mile
    }
}

// Output:
// 8
// null
