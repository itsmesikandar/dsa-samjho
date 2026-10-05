import java.util.Arrays;

class Main {
    // Sorted array: har number ZYADA SE ZYADA 2 baar rahe (in-place). Naya length return.
    static int removeDuplicatesII(int[] nums) {
        int w = 0; // kitne items likh chuke //@init
        for (int x : nums) {
            // pehle 2 hamesha rakho; uske baad tabhi jab 2 peeche wale (likhe hue) se alag ho
            if (w < 2 || x != nums[w - 2]) { //@check
                nums[w] = x; //@write
                w++;
            }
        }
        return w; //@done
    }

    public static void main(String[] args) {
        int[] a = {1, 1, 1, 2, 2, 3};
        int k = removeDuplicatesII(a);
        System.out.println(k);
        System.out.println(Arrays.toString(Arrays.copyOf(a, k)));
    }
}

// Output:
// 5
// [1, 1, 2, 2, 3]
