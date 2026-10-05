import java.util.Arrays;

class Main {
    // Har i ke liye baaki sab ka product - bina division ke, O(n)
    static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        res[0] = 1; // index 0 ke left mein kuch nahi
        for (int i = 1; i < n; i++) {
            res[i] = res[i - 1] * nums[i - 1]; // res[i] = i ke LEFT wale sab ka product //@left
        }
        int right = 1; // i ke RIGHT wale sab ka product (peeche se chalte hue)
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right; // left x right = sab, sirf nums[i] chhod ke //@right
            right *= nums[i];
        }
        return res; //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(productExceptSelf(new int[]{1, 2, 3, 4})));
        System.out.println(Arrays.toString(productExceptSelf(new int[]{-1, 1, 0, -3, 3}))); // 0 wala case
    }
}

// Output:
// [24, 12, 8, 6]
// [0, 0, 9, 0, 0]
