import java.util.ArrayList;
import java.util.List;

class Main {
    static class DNode {
        final int value;
        DNode prev, next;

        DNode(int value) {
            this.value = value;
        }
    }

    // Doubly list ulti karo: har node ke prev aur next swap; naya head = purana aakhri node
    static DNode reverse(DNode head) {
        DNode cur = head, newHead = null;
        while (cur != null) {
            DNode nxt = cur.next; // swap se pehle aage ka raasta bachao //@save
            cur.next = cur.prev; // dono arrows ulte //@swap
            cur.prev = nxt;
            newHead = cur; // aakhri dekha node hi naya head banega //@head
            cur = nxt;
        }
        return newHead;
    }

    static DNode build(int... xs) {
        DNode head = null, last = null;
        for (int x : xs) {
            DNode n = new DNode(x);
            n.prev = last;
            if (last == null) head = n;
            else last.next = n;
            last = n;
        }
        return head;
    }

    static String forward(DNode head) {
        List<Integer> out = new ArrayList<>();
        for (DNode c = head; c != null; c = c.next) out.add(c.value);
        return out.toString();
    }

    static String backward(DNode head) { // end tak jao, phir prev se wapas - prev arrows sahi hain ya nahi?
        DNode c = head;
        while (c != null && c.next != null) c = c.next;
        List<Integer> out = new ArrayList<>();
        for (; c != null; c = c.prev) out.add(c.value);
        return out.toString();
    }

    public static void main(String[] args) {
        DNode h = reverse(build(1, 2, 3, 4));
        System.out.println(forward(h));
        System.out.println(backward(h));
    }
}

// Output:
// [4, 3, 2, 1]
// [1, 2, 3, 4]
