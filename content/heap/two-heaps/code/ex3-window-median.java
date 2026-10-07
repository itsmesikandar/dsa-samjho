import java.util.Arrays;
import java.util.Collections;
import java.util.PriorityQueue;

class Main {
    // Har step: naya andar, purana bahar, phir balance. Median = tops se
    static double[] medianSlidingWindow(int[] nums, int k) {
        PriorityQueue<Integer> left = new PriorityQueue<>(Collections.reverseOrder()); // window ka chhota aadha
        PriorityQueue<Integer> right = new PriorityQueue<>(); // window ka bada aadha
        double[] out = new double[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            if (left.isEmpty() || nums[i] <= left.peek()) left.add(nums[i]); else right.add(nums[i]); // naya andar //@add
            if (i >= k) { // window aage shift hui - nums[i - k] bahar
                Integer old = nums[i - k]; // Integer: remove(Object) chahiye
                if (old <= left.peek()) left.remove(old); else right.remove(old); // jis aadhe mein hai wahin se, O(k) //@remove
            }
            if (left.size() > right.size() + 1) right.add(left.poll()); // sizes theek karo //@fix
            else if (right.size() > left.size()) left.add(right.poll());
            if (i >= k - 1) { // window poori - median likho //@median
                out[i - k + 1] = left.size() > right.size() ? left.peek()
                        : ((long) left.peek() + right.peek()) / 2.0;
            }
        }
        return out;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(medianSlidingWindow(new int[] {5, 2, 8, 1, 9, 3, 7}, 3)));
        System.out.println(Arrays.toString(medianSlidingWindow(new int[] {4, 4, 1, 7}, 2)));
        System.out.println(Arrays.toString(medianSlidingWindow(new int[] {2147483647, 2147483647}, 2)));
    }
}

// Output:
// [5.0, 2.0, 8.0, 3.0, 7.0]
// [4.0, 2.5, 4.0]
// [2.147483647E9]
