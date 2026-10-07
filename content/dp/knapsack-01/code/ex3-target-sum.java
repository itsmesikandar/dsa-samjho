class Main {
    // Har number ke aage + ya -. P = plus walon ka jod, N = minus walon ka. P - N = target, P + N = total
    // => P = (total + target) / 2. Ab sawaal: kitne subsets ka jod P? (0/1 knapsack - count)
    static int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int x : nums) total += x;
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0; // P poora number hi nahi ban sakta //@check
        int p = (total + target) / 2;
        int[] dp = new int[p + 1]; // dp[s] = kitne subsets ka jod s
        dp[0] = 1; // khaali subset
        for (int x : nums) {
            for (int s = p; s >= x; s--) {
                dp[s] += dp[s - x]; // x ko '+' mein daala: jo subsets s - x banate the, ab s banate //@count
            }
        }
        return dp[p]; //@done
    }

    public static void main(String[] args) {
        System.out.println(findTargetSumWays(new int[] {2, 1, 3, 1}, 3));
        System.out.println(findTargetSumWays(new int[] {1}, 2));
    }
}

// Output:
// 2
// 0
