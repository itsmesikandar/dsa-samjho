class Main {
    // Brute force O(n^2): har start se har end tak ka sum (running sum se, O(n^3) nahi)
    static int maxSubArrayBrute(int[] nums) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) { // subarray kahan se shuru
            int sum = 0;
            for (int j = i; j < nums.length; j++) { // kahan khatam
                sum += nums[j]; // pichle sum mein bas ek aur item
                best = Math.max(best, sum);
            }
        }
        return best;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSubArrayBrute(nums));
        System.out.println(nums.length * (nums.length + 1) / 2); // kitne subarrays check hue
    }
}

// Output:
// 6
// 45
