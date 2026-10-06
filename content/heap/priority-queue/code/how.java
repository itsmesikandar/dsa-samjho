import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Emergency ward: zyada severity pehle; barabar ho to jo pehle aaya wo pehle
    static List<Character> treatOrder(int[] sev) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> // x = [severity, aane ka number]
            x[0] != y[0] ? Integer.compare(y[0], x[0]) // bada severity upar (ulta compare) //@cmp
                : Integer.compare(x[1], y[1])); // tie: jo pehle aaya wo upar
        for (int i = 0; i < sev.length; i++) pq.add(new int[] {sev[i], i}); // end par + sift up, O(log n) //@add
        List<Character> order = new ArrayList<>();
        while (!pq.isEmpty()) order.add((char) ('A' + pq.poll()[1])); // root nikaalo + sift down, O(log n) //@poll
        return order;
    }

    public static void main(String[] args) {
        System.out.println(treatOrder(new int[] {2, 5, 1, 5, 3}));
        System.out.println(treatOrder(new int[] {4, 4, 4}));
    }
}

// Output:
// [B, D, E, A, C]
// [A, B, C]
