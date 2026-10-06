import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

class Main {
    // k sabse zyada baar aane wale: pehle HashMap mein count, phir count par size k ka min-heap
    static List<Integer> topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        // kam count upar (barabar ho to bada number upar - wahi pehle bahar, taaki output pakka rahe)
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> {
            int ca = count.get(a), cb = count.get(b);
            return ca != cb ? Integer.compare(ca, cb) : Integer.compare(b, a);
        });
        for (int x : count.keySet()) {
            pq.add(x);
            if (pq.size() > k) pq.poll(); // sabse kam count wala bahar
        }
        List<Integer> out = new ArrayList<>(pq);
        out.sort((a, b) -> {
            int ca = count.get(a), cb = count.get(b);
            return ca != cb ? Integer.compare(cb, ca) : Integer.compare(a, b); // zyada count pehle
        });
        return out;
    }

    public static void main(String[] args) {
        System.out.println(topKFrequent(new int[] {1, 1, 1, 2, 2, 3}, 2));
        System.out.println(topKFrequent(new int[] {4, 4, 5, 5, 6}, 1));
    }
}

// Output:
// [1, 2]
// [4]
