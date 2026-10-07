import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Two heaps ka general form: left mein hamesha "rank" sabse chhote. Left ka top = p-th percentile
    static List<Integer> runningPercentile(int[] nums, int p) {
        PriorityQueue<Integer> left = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> right = new PriorityQueue<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            int x = nums[i];
            if (left.isEmpty() || x <= left.peek()) left.add(x); else right.add(x);
            int rank = (p * (i + 1) + 99) / 100; // ceil(p% of n) - integer math, double nahi
            while (left.size() > rank) right.add(left.poll()); // left mein zyada - top right mein
            while (left.size() < rank) left.add(right.poll()); // left mein kam - right ka top left mein
            out.add(left.peek());
        }
        return out;
    }

    public static void main(String[] args) {
        int[] ms = {120, 80, 300, 95, 110, 2000, 90, 105, 100, 130}; // API response time (ms)
        System.out.println(runningPercentile(ms, 50));
        System.out.println(runningPercentile(ms, 90));
    }
}

// Output:
// [120, 80, 120, 95, 110, 110, 110, 105, 105, 105]
// [120, 120, 300, 300, 300, 2000, 2000, 2000, 2000, 300]
