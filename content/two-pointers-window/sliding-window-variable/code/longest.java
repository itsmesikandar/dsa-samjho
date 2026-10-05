class Main {
    // Sabse lamba lagatar subarray jiska sum <= limit (saare numbers positive)
    static int longestWithSumAtMost(int[] nums, int limit) {
        int l = 0;
        int sum = 0;
        int best = 0;
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r]; // 1. r ko andar lo
            while (sum > limit) { // 2. invalid? jab tak valid na ho, l ko nikaalo
                sum -= nums[l];
                l++;
            }
            best = Math.max(best, r - l + 1); // 3. window ab valid hai: answer update
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestWithSumAtMost(new int[]{3, 1, 2, 1, 4, 1, 1}, 5));
        System.out.println(longestWithSumAtMost(new int[]{9, 9}, 5)); // har item akela bhi bada: 0
    }
}

// Output:
// 3
// 0
