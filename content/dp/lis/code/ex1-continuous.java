class Main {
    // Sabse lamba CONTINUOUS (subarray) badhta hissa. dp[i] = dp[i-1] + 1 ya 1 - bas ek variable kaafi
    static int findLengthOfLCIS(int[] nums) {
        int best = 0;
        int cur = 0; // i par khatam hone wala continuous badhta hissa
        for (int i = 0; i < nums.length; i++) {
            cur = (i > 0 && nums[i - 1] < nums[i]) ? cur + 1 : 1; // badha to chain aage, warna naya shuru //@step
            best = Math.max(best, cur);
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(findLengthOfLCIS(new int[] {2, 6, 7, 3, 5, 8, 9, 1}));
        System.out.println(findLengthOfLCIS(new int[] {3, 3, 3}));
    }
}

// Output:
// 4
// 1
