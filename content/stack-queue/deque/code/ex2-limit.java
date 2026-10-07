import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // Sabse lamba continuous subarray jismein (max - min) <= limit
    static int longestSubarray(int[] nums, int limit) {
        Deque<Integer> maxD = new ArrayDeque<>(); // values ghatti hui: aage = window ka max
        Deque<Integer> minD = new ArrayDeque<>(); // values badhti hui: aage = window ka min
        int l = 0, best = 0;
        for (int r = 0; r < nums.length; r++) {
            while (!maxD.isEmpty() && maxD.peekLast() < nums[r]) maxD.pollLast(); //@push
            maxD.offerLast(nums[r]);
            while (!minD.isEmpty() && minD.peekLast() > nums[r]) minD.pollLast();
            minD.offerLast(nums[r]);
            while (maxD.peekFirst() - minD.peekFirst() > limit) { // window kharab: l se shrink karo //@shrink
                if (maxD.peekFirst() == nums[l]) maxD.pollFirst(); // bahar jaane wala hi max tha
                if (minD.peekFirst() == nums[l]) minD.pollFirst(); // ya min tha
                l++;
            }
            best = Math.max(best, r - l + 1); //@update
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestSubarray(new int[]{10, 1, 2, 4, 7, 2}, 5));
        System.out.println(longestSubarray(new int[]{8, 2, 4, 7}, 4));
        System.out.println(longestSubarray(new int[]{4, 2, 2, 2, 4, 4, 2, 2}, 0));
    }
}

// Output:
// 4
// 2
// 3
