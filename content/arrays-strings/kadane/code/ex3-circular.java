class Main {
    // Circular array: last ke baad wapas pehla. Max subarray sum?
    static int maxCircular(int[] nums) {
        int curMax = 0, best = nums[0]; // normal Kadane ka answer (bina wrap)
        int curMin = 0, worst = nums[0]; // sabse CHHOTA subarray sum (ulta Kadane)
        int total = 0;
        for (int x : nums) {
            curMax = Math.max(curMax + x, x); //@max
            best = Math.max(best, curMax);
            curMin = Math.min(curMin + x, x); // wahi Kadane, bas min ke liye //@min
            worst = Math.min(worst, curMin);
            total += x;
        }
        // wrap wala answer = total - (beech ka sabse bura hissa)
        // sab negative hon to total - worst = 0 (khaali subarray) - galat, isliye best hi lo
        return best < 0 ? best : Math.max(best, total - worst); //@done
    }

    public static void main(String[] args) {
        System.out.println(maxCircular(new int[]{5, -3, 5})); // wrap: 5 + 5
        System.out.println(maxCircular(new int[]{-3, -2, -3})); // sab negative
        System.out.println(maxCircular(new int[]{1, -2, 3, -2})); // wrap se fayda nahi
    }
}

// Output:
// 10
// -2
// 3
