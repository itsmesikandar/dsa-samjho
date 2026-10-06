class Main {
    // Unbounded knapsack: rod ko tukdon mein kaato, har length ka tukda KITNI BHI baar. Max kamai
    // price[k - 1] = length k ke tukde ka daam, rod ki length = price.length
    static int rodCut(int[] price) {
        int n = price.length;
        int[][] dp = new int[n + 1][n + 1]; // dp[i][w] = length 1..i ke tukde allowed, rod w -> max kamai
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= n; w++) {
                dp[i][w] = dp[i - 1][w]; // length i ka tukda mat kaato //@skip
                if (i <= w) {
                    dp[i][w] = Math.max(dp[i][w], dp[i][w - i] + price[i - 1]); // kaato: ISI row se - bachi rod mein i phir kaat sakte //@take
                }
            }
        }
        return dp[n][n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(rodCut(new int[] {2, 5, 9, 10, 12}));
        System.out.println(rodCut(new int[] {3, 5, 8, 9}));
    }
}

// Output:
// 14
// 12
