class Main {
    // Size k ki har window (continuous k items) mein sabse bada sum
    static int maxSumK(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i]; // pehli window ka sum, ek baar poora jodo //@first
        int best = sum;
        for (int r = k; r < nums.length; r++) { // window ek step aage shift hui
            sum += nums[r] - nums[r - k]; // naya item andar, sabse purana bahar //@slide
            best = Math.max(best, sum); //@best
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxSumK(new int[]{2, 1, 5, 1, 3, 2}, 3));
        System.out.println(maxSumK(new int[]{-1, -2, -3}, 2)); // sab negative: best bhi negative
    }
}

// Output:
// 9
// -3
