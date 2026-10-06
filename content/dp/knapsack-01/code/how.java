class Main {
    // 0/1 knapsack: har item ya poora lo ya chhodo (ek hi baar). Bag ki capacity ke andar max value
    static int knapsack(int[] wt, int[] value, int cap) {
        int n = wt.length;
        int[][] dp = new int[n + 1][cap + 1]; // dp[i][w] = pehle i items, capacity w -> max value
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= cap; w++) {
                dp[i][w] = dp[i - 1][w]; // item i-1 chhodo: pichhle items ka hi best //@skip
                if (wt[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt[i - 1]] + value[i - 1]); // lo: bachi jagah mein pichhle items ka best + iski value //@take
                }
            }
        }
        return dp[n][cap]; //@done
    }

    public static void main(String[] args) {
        System.out.println(knapsack(new int[] {1, 3, 4, 5}, new int[] {1, 4, 5, 7}, 7));
        System.out.println(knapsack(new int[] {2}, new int[] {10}, 1));
    }
}

// Output:
// 9
// 0
