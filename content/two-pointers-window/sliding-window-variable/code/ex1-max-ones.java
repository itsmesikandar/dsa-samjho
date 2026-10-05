class Main {
    // 0/1 array. Zyada se zyada k zeros ko 1 bana sakte ho. Sabse lambi lagatar 1s ki line kitni?
    static int longestOnes(int[] nums, int k) {
        int l = 0;
        int zeros = 0; // window mein kitne 0 (jinhe flip karna padega)
        int best = 0;
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] == 0) zeros++; //@expand
            while (zeros > k) { // flips kam pad gaye: l se sikodo //@shrink
                if (nums[l] == 0) zeros--;
                l++;
            }
            best = Math.max(best, r - l + 1); //@update
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestOnes(new int[]{1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0}, 2));
        System.out.println(longestOnes(new int[]{0, 0, 0}, 0));
    }
}

// Output:
// 6
// 0
