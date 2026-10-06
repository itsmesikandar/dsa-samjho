class Main {
    // House robber: padosi do ghar ek saath nahi. Har ghar par do hi faisle - lo ya chhodo
    static int rob(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n + 1]; // dp[i] = pehle i gharon (0..i-1) se max paisa
        dp[1] = nums[0]; // ek hi ghar - le lo //@base
        for (int i = 2; i <= n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]); // chhodo: pichhla best; lo: i-2 tak ka best + ye ghar //@choose
        }
        return dp[n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[] {4, 1, 2, 7, 5, 3, 1}));
        System.out.println(rob(new int[] {5}));
        System.out.println(rob(new int[] {2, 1, 1, 2}));
    }
}

// Output:
// 14
// 5
// 4
