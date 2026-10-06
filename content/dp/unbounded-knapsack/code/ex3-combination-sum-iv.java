class Main {
    // Order MATTER karta hai (1+3 aur 3+1 alag). TARGET BAHAR, numbers andar - har s par 'aakhri number kaunsa' chuno
    static int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1]; // dp[s] = kitni sequences ka jod s
        dp[0] = 1; // khaali sequence
        for (int s = 1; s <= target; s++) {
            for (int x : nums) {
                if (x <= s) dp[s] += dp[s - x]; // aakhri number x: pehle s - x tak koi bhi sequence //@add
            }
        }
        return dp[target]; //@done
    }

    public static void main(String[] args) {
        System.out.println(combinationSum4(new int[] {1, 3, 4}, 5));
        System.out.println(combinationSum4(new int[] {2, 1}, 3));
    }
}

// Output:
// 6
// 3
