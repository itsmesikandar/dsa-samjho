import java.util.Arrays;

class Main {
    // Saare 0 end mein, baaki numbers ka order wahi rahe (in-place)
    static void moveZeroes(int[] nums) {
        int w = 0; // agla non-zero kahan aayega //@init
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] != 0) { // non-zero mila? //@check
                int t = nums[w]; // swap: non-zero aage, wahan wala 0 peeche //@swap
                nums[w] = nums[r];
                nums[r] = t;
                w++;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {0, 1, 0, 3, 12};
        moveZeroes(a);
        System.out.println(Arrays.toString(a));
        int[] b = {0};
        moveZeroes(b);
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [1, 3, 12, 0, 0]
// [0]
