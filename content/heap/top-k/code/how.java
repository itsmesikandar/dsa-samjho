import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // k sabse chhote: size k ka MAX-heap. Root = andar ka sabse bada = sabse pehle bahar jaane layak
    static List<Integer> kSmallest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int x : nums) {
            if (pq.size() < k) pq.add(x); // jagah khaali - seedha andar //@add
            else if (x < pq.peek()) { // andar ke sabse bade se chhota - behtar candidate //@check
                pq.poll(); // sabse bada bahar, naya andar //@swap
                pq.add(x);
            }
        }
        List<Integer> out = new ArrayList<>(pq); // bache k items sort: O(k log k) //@done
        Collections.sort(out);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(kSmallest(new int[] {7, 2, 9, 4, 1, 8, 3}, 3));
        System.out.println(kSmallest(new int[] {5, 5, 5}, 2));
    }
}

// Output:
// [1, 2, 3]
// [5, 5]
