class Main {
    // 1D knapsack: dp[w] mein abhi pichhle items ka best hai. Capacity ULTI chalao - dp[w - wt] abhi purana (is item se pehle ka)
    // Seedhi chalao to dp[w - wt] mein ye item pehle hi jud chuka - ek item kai baar (ye unbounded ho gaya)
    static int knap1D(int[] wt, int[] value, int cap, boolean reverse) {
        int[] dp = new int[cap + 1];
        for (int i = 0; i < wt.length; i++) {
            if (reverse) {
                for (int w = cap; w >= wt[i]; w--) dp[w] = Math.max(dp[w], dp[w - wt[i]] + value[i]);
            } else {
                for (int w = wt[i]; w <= cap; w++) dp[w] = Math.max(dp[w], dp[w - wt[i]] + value[i]);
            }
        }
        return dp[cap];
    }

    public static void main(String[] args) {
        int[] wt = {2};
        int[] v = {3};
        System.out.println("ulta (0/1): " + knap1D(wt, v, 6, true) + ", seedha (galti se 3 baar): " + knap1D(wt, v, 6, false));
        System.out.println(knap1D(new int[] {1, 3, 4, 5}, new int[] {1, 4, 5, 7}, 7, true));
    }
}

// Output:
// ulta (0/1): 3, seedha (galti se 3 baar): 9
// 9
