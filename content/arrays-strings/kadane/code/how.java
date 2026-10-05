class Main {
    // Kadane: sabse bada subarray sum, ek hi pass mein
    static int maxSubArray(int[] nums) {
        int cur = nums[0]; // "is index par khatam hone wala" best sum //@init
        int best = nums[0]; // ab tak ka sabse bada
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]); // purana sum saath lo, ya yahin se naya shuru? //@choose
            best = Math.max(best, cur); // record toota? //@best
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
        System.out.println(maxSubArray(new int[]{-3, -1, -2})); // sab negative: sabse chhota nuksaan
    }
}

// Output:
// 6
// -1
