import java.util.Arrays;

class Main {
    // Sorted array se duplicates hatao (in-place). Kitne unique bache, wo return karo.
    static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int w = 1; // agla unique item kahan likhna hai (index 0 hamesha unique) //@init
        for (int r = 1; r < nums.length; r++) { // r: padhne wala pointer, hamesha aage
            if (nums[r] != nums[w - 1]) { // pichle LIKHE item se alag = naya unique //@check
                nums[w] = nums[r]; //@write
                w++;
            }
        }
        return w; // pehle w items unique hain //@done
    }

    public static void main(String[] args) {
        int[] a = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        int k = removeDuplicates(a);
        System.out.println(k);
        System.out.println(Arrays.toString(Arrays.copyOf(a, k)));
    }
}

// Output:
// 5
// [0, 1, 2, 3, 4]
