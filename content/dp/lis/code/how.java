import java.util.Arrays;

class Main {
    // LIS: sabse lamba STRICTLY badhta subsequence. dp[i] = i par KHATAM hone wala sabse lamba
    static int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1); // har element akela bhi ek chain (length 1) //@init
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1); // j wali chain ke peeche i jod do //@try
            }
        }
        int best = 0;
        for (int x : dp) best = Math.max(best, x);
        return best; // jawab kisi bhi i par khatam ho sakta - isliye max //@done
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[] {5, 2, 8, 6, 3, 6, 9, 7}));
        System.out.println(lengthOfLIS(new int[] {4, 4, 4}));
    }
}

// Output:
// 4
// 1
