class Main {
    // dp[i] = seedhi i tak pahunchne ke tareeke. Aakhri step ya to 1 ka (i-1 se) ya 2 ka (i-2 se)
    static int climbStairs(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1; // land par: 1 tareeka (kuch mat karo)
        dp[1] = 1; // ek seedhi: sirf 1 ka step //@base
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2]; // dono tarah ke aakhri step alag tareeke hain - jodo //@step
        }
        return dp[n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));
        System.out.println(climbStairs(1));
        System.out.println(climbStairs(30));
    }
}

// Output:
// 8
// 1
// 1346269
