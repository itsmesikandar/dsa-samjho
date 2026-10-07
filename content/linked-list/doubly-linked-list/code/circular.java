import java.util.ArrayList;
import java.util.List;

class Main {
    // Circular list: aakhri node ka next wapas pehle ko. Josephus game:
    // n log circle mein, har k-th insaan bahar. Kis order mein bahar honge?
    static class CNode {
        final int value;
        CNode next = this; // akela node khud ko point kare

        CNode(int value) {
            this.value = value;
        }
    }

    static List<Integer> eliminationOrder(int n, int k) {
        CNode first = new CNode(1);
        CNode last = first;
        for (int v = 2; v <= n; v++) {
            CNode node = new CNode(v);
            last.next = node;
            last = node;
        }
        last.next = first; // aakhri wapas pehle ko: circle poora
        List<Integer> out = new ArrayList<>();
        CNode prev = last; // jise hataana hai uske PICHHLE par khade raho
        for (int r = 0; r < n; r++) {
            for (int s = 0; s < k - 1; s++) prev = prev.next; // k - 1 aage count karo (circle hai, null kabhi nahi)
            CNode gone = prev.next;
            out.add(gone.value);
            prev.next = gone.next; // circle se bahar
        }
        return out;
    }

    public static void main(String[] args) {
        System.out.println(eliminationOrder(5, 2));
        System.out.println(eliminationOrder(7, 3));
    }
}

// Output:
// [2, 4, 1, 5, 3]
// [3, 6, 2, 7, 5, 1, 4]
