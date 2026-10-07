import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // Sabse chhota continuous subarray jiska sum >= k. Numbers NEGATIVE bhi ho sakte hain. Na ho to -1.
    static int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        long[] pre = new long[n + 1]; // pre[j] - pre[i] = index i..j-1 ka sum
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
        Deque<Integer> dq = new ArrayDeque<>(); // start indexes; inke pre values BADHTE hue
        int best = Integer.MAX_VALUE;
        for (int j = 0; j <= n; j++) {
            while (!dq.isEmpty() && pre[j] - pre[dq.peekFirst()] >= k) { // sabse purana start chal gaya - usse chhota kabhi nahi milega //@found
                best = Math.min(best, j - dq.pollFirst());
            }
            while (!dq.isEmpty() && pre[dq.peekLast()] >= pre[j]) dq.pollLast(); // j better start hai: pre chhota/barabar AUR baad mein //@pop
            dq.offerLast(j); //@push
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }

    public static void main(String[] args) {
        System.out.println(shortestSubarray(new int[]{2, -1, 2}, 3));
        System.out.println(shortestSubarray(new int[]{1, 2}, 4));
        System.out.println(shortestSubarray(new int[]{84, -37, 32, 40, 95}, 167));
    }
}

// Output:
// 3
// -1
// 3
