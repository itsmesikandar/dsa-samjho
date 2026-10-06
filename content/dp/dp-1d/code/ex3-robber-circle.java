class Main {
    // Gol mohalla: pehla aur aakhri ghar padosi. Dono ek saath nahi - to do seedhi lines: pehla hata ke, aakhri hata ke
    static int robLine(int[] nums, int lo, int hi) { // lo..hi ek seedhi line (house robber)
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]); //@line
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    static int rob2(int[] nums) {
        if (nums.length == 1) return nums[0]; // ek hi ghar - koi padosi nahi //@one
        return Math.max(robLine(nums, 0, nums.length - 2), robLine(nums, 1, nums.length - 1)); // aakhri chhodo / pehla chhodo //@split
    }

    public static void main(String[] args) {
        System.out.println(rob2(new int[] {6, 2, 3, 7}));
        System.out.println(rob2(new int[] {5}));
        System.out.println(rob2(new int[] {3, 9, 4}));
    }
}

// Output:
// 9
// 5
// 9
