class Main {
    // Climbing stairs ka general form: allowed step ek set mein. dp[i] = sab s ke liye dp[i - s] ka jod
    static long countWays(int n, int[] steps) {
        long[] dp = new long[n + 1];
        dp[0] = 1; // khaali rasta - 1 tareeka
        for (int i = 1; i <= n; i++) {
            for (int s : steps) {
                if (s <= i) dp[i] += dp[i - s]; // aakhri step s ka tha - pehle i - s tak pahunche the
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(countWays(4, new int[] {1, 2, 3}));
        System.out.println(countWays(5, new int[] {1, 2})); // climbing stairs hi
        System.out.println(countWays(7, new int[] {2, 5}));
    }
}

// Output:
// 7
// 8
// 2
