class Main {
    // Sabse chhota continuous subarray jiska sum >= target (saare numbers positive). Na mile to 0.
    static int minSubArrayLen(int target, int[] nums) {
        int l = 0;
        int sum = 0;
        int best = Integer.MAX_VALUE; // abhi tak koi valid window nahi //@init
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r]; // window right spread karo //@expand
            while (sum >= target) { // valid hai: ab chhota karke dekho //@check
                best = Math.min(best, r - l + 1); //@update
                sum -= nums[l]; // left se shrink karo //@shrink
                l++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best; //@done
    }

    public static void main(String[] args) {
        System.out.println(minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3}));
        System.out.println(minSubArrayLen(100, new int[]{1, 2, 3})); // poora array bhi kam pada
    }
}

// Output:
// 2
// 0
