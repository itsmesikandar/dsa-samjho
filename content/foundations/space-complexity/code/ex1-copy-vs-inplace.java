import java.util.Arrays;

class Main {
    // Tareeka 1: nayi array mein ulta copy -> O(n) extra space
    static int[] reversedCopy(int[] arr) {
        int[] res = new int[arr.length]; // n naye dabbe //@alloc
        for (int i = 0; i < arr.length; i++) {
            res[i] = arr[arr.length - 1 - i]; // peeche se utha ke aage rakho //@copy
        }
        return res;
    }

    // Tareeka 2: usi array mein swap -> O(1) extra space (sirf l, r, temp)
    static void reverseInPlace(int[] arr) {
        int l = 0, r = arr.length - 1;
        while (l < r) {
            int temp = arr[l]; //@swap
            arr[l] = arr[r];
            arr[r] = temp;
            l++;
            r--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4};
        System.out.println(Arrays.toString(reversedCopy(a))); // a waisa hi raha
        reverseInPlace(a); // ab a khud ulta
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [4, 3, 2, 1]
// [4, 3, 2, 1]
