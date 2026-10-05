import java.util.Arrays;

class Main {
    // Max subarray sum ke saath uska start aur end index bhi: [sum, start, end]
    static int[] maxSubArrayRange(int[] nums) {
        int cur = nums[0]; //@init
        int curStart = 0; // abhi wale subarray ki shuruaat
        int best = nums[0], bestL = 0, bestR = 0;
        for (int i = 1; i < nums.length; i++) {
            if (cur < 0) { // purana sum bojh hai (negative) -> chhodo, yahin se naya shuru //@restart
                cur = nums[i];
                curStart = i;
            } else { // purana sum faydemand -> jodte raho //@extend
                cur += nums[i];
            }
            if (cur > best) { // naya record: range bhi yaad rakho //@best
                best = cur;
                bestL = curStart;
                bestR = i;
            }
        }
        return new int[]{best, bestL, bestR}; //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxSubArrayRange(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})));
        System.out.println(Arrays.toString(maxSubArrayRange(new int[]{5, -9, 6})));
    }
}

// Output:
// [6, 3, 6]
// [6, 2, 2]
