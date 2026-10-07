import java.util.Arrays;

class Main {
    // SORTED array mein 2 numbers jinka sum = target. Unke index do, na mile to [-1, -1].
    // Brute force O(n^2). "Sorted" ka hint use karke two pointers -> O(n).
    static int[] pairWithSum(int[] arr, int target) {
        int l = 0; //@init
        int r = arr.length - 1;
        while (l < r) {
            int s = arr[l] + arr[r]; //@sum
            if (s == target) return new int[]{l, r}; //@found
            if (s < target) l++; // sum chhota: badi value chahiye, l aage //@left
            else r--; // sum bada: chhoti value chahiye, r peeche //@right
        }
        return new int[]{-1, -1}; //@none
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(pairWithSum(new int[]{1, 3, 4, 6, 8, 11}, 10)));
        System.out.println(Arrays.toString(pairWithSum(new int[]{1, 2, 3}, 7)));
    }
}

// Output:
// [2, 3]
// [-1, -1]
