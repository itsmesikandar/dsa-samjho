import java.util.Collections;
import java.util.PriorityQueue;

class Main {
    // Har number pehle left se pass hota hai - isliye "kis heap mein?" wala if nahi chahiye
    static class MedianFinder {
        private final PriorityQueue<Integer> left = new PriorityQueue<>(Collections.reverseOrder()); // chhota aadha (max-heap)
        private final PriorityQueue<Integer> right = new PriorityQueue<>(); // bada aadha (min-heap)

        void addNum(int num) {
            left.add(num); // 1. pehle left mein //@push
            right.add(left.poll()); // 2. left ka sabse bada right mein - order pakka (left <= right) //@move
            if (right.size() > left.size()) left.add(right.poll()); // 3. size: left = right ya right + 1 //@balance
        }

        double findMedian() {
            if (left.size() > right.size()) return left.peek(); // odd: left ka top //@find
            return ((long) left.peek() + right.peek()) / 2.0; // even: dono tops ka average
        }
    }

    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        for (int x : new int[] {6, 10, 2, 6, 5, 0}) mf.addNum(x);
        System.out.println(mf.findMedian());
        mf.addNum(6);
        System.out.println(mf.findMedian());
    }
}

// Output:
// 5.5
// 6.0
