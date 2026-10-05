import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    // Size k ki har window (lagatar k items) ka maximum - O(n) mein
    static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>(); // INDEXES; inki values aage se peeche GHATTI hui (decreasing)
        int[] res = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst(); // aage wala window se bahar ho gaya //@drop
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast(); // naya bada aaya: peeche ke chhote ab kabhi max nahi banenge //@pop
            dq.offerLast(i); //@push
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()]; // aage wala = window ka max //@max
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1}, 1)));
    }
}

// Output:
// [3, 3, 5, 5, 6, 7]
// [1]
