import java.util.PriorityQueue;

class Main {
    // Size k ka min-heap: k sabse bade andar, unme sabse chhota (root) = kth largest
    static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap //@init
        for (int x : nums) {
            pq.add(x); // pehle daalo //@add
            if (pq.size() > k) pq.poll(); // k se zyada - sabse chhota top k mein nahi aa sakta //@trim
        }
        return pq.peek(); //@ans
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[] {3, 2, 1, 5, 6, 4}, 2));
        System.out.println(findKthLargest(new int[] {3, 2, 3, 1, 2, 4, 5, 5, 6}, 4));
        System.out.println(findKthLargest(new int[] {-1, -5}, 2));
    }
}

// Output:
// 5
// 4
// -5
