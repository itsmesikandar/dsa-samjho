class Main {
    // Size k ki window ka sabse bada average
    static double findMaxAverage(int[] nums, int k) {
        long sum = 0; // long: bade inputs par overflow se bachne ke liye
        for (int i = 0; i < k; i++) sum += nums[i];
        long best = sum;
        for (int r = k; r < nums.length; r++) {
            sum += nums[r] - nums[r - k];
            best = Math.max(best, sum);
        }
        return (double) best / k; // divide sirf end mein, ek baar (sum bada = average bada)
    }

    public static void main(String[] args) {
        System.out.println(findMaxAverage(new int[]{1, 12, -5, -6, 50, 3}, 4));
        System.out.println(findMaxAverage(new int[]{5}, 1));
    }
}

// Output:
// 12.75
// 5.0
