class Main {
    // 1D unbounded knapsack: capacity SEEDHI chalao. dp[w - wt] mein ye item pehle hi ho sakta hai - aur yahi chahiye (kitni bhi baar)
    static int unbounded(int[] wt, int[] value, int cap) {
        int[] dp = new int[cap + 1]; // dp[w] = jagah w mein max value
        for (int i = 0; i < wt.length; i++) {
            for (int w = wt[i]; w <= cap; w++) dp[w] = Math.max(dp[w], dp[w - wt[i]] + value[i]);
        }
        return dp[cap];
    }

    // Doosra order: capacity bahar, items andar - "aakhri item kaunsa?". Max / min mein dono order ka jawab same
    static int unboundedCapFirst(int[] wt, int[] value, int cap) {
        int[] dp = new int[cap + 1];
        for (int w = 1; w <= cap; w++) {
            for (int i = 0; i < wt.length; i++) {
                if (wt[i] <= w) dp[w] = Math.max(dp[w], dp[w - wt[i]] + value[i]);
            }
        }
        return dp[cap];
    }

    public static void main(String[] args) {
        int[] wt = {1, 2, 3, 4, 5};
        int[] v = {2, 5, 9, 10, 12};
        System.out.println(unbounded(wt, v, 5) + " " + unboundedCapFirst(wt, v, 5));
        System.out.println(unbounded(new int[] {2}, new int[] {3}, 6)); // 2kg wala 3 baar
    }
}

// Output:
// 14 14
// 9
