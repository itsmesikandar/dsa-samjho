import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Running median: chhota aadha MAX-heap (left), bada aadha MIN-heap (right). Median = tops se
    static List<Double> runningMedian(int[] nums) {
        PriorityQueue<Integer> left = new PriorityQueue<>(Collections.reverseOrder()); // chhote numbers - top = unme sabse bada //@init
        PriorityQueue<Integer> right = new PriorityQueue<>(); // bade numbers - top = unme sabse chhota
        List<Double> out = new ArrayList<>();
        for (int x : nums) {
            if (left.isEmpty() || x <= left.peek()) left.add(x); // left ke top se chhota/barabar - chhote aadhe ka //@toL
            else right.add(x); // warna bade aadhe ka //@toR
            if (left.size() > right.size() + 1) right.add(left.poll()); // left 2 aage - uska top right mein //@fixL
            else if (right.size() > left.size()) left.add(right.poll()); // right aage - uska top left mein //@fixR
            double m = left.size() > right.size() ? left.peek() // odd: beech wala = left ka top //@median
                    : ((long) left.peek() + right.peek()) / 2.0; // even: dono tops ka average (long - overflow nahi)
            out.add(m);
        }
        return out;
    }

    public static void main(String[] args) {
        System.out.println(runningMedian(new int[] {5, 15, 1, 3, 8}));
        System.out.println(runningMedian(new int[] {2, 2, 2}));
        System.out.println(runningMedian(new int[] {-4, 6}));
    }
}

// Output:
// [5.0, 10.0, 5.0, 4.0, 5.0]
// [2.0, 2.0, 2.0]
// [-4.0, 1.0]
