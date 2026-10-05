class Main {
    // Har subset ke saare numbers ka XOR nikaalo, phir sab subsets ke XOR jodo
    static int subsetXORSum(int[] nums) {
        return go(nums, 0, 0);
    }

    static int go(int[] nums, int i, int x) { // x = abhi tak chune numbers ka XOR (parameter = apne aap undo)
        if (i == nums.length) return x; // ek subset poora: uska XOR //@leaf
        return go(nums, i + 1, x ^ nums[i]) + go(nums, i + 1, x); // nums[i] lo + chhodo //@branch
    }

    public static void main(String[] args) {
        System.out.println(subsetXORSum(new int[]{5, 1, 6}));
        System.out.println(subsetXORSum(new int[]{1, 3}));
    }
}

// Output:
// 28
// 6
