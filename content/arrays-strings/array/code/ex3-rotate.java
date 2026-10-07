import java.util.Arrays;

class Main {
    // arr ke [from..to] hisse ko ulta karo (wahi two-pointer swap)
    static void reverse(int[] arr, int from, int to) {
        int l = from, r = to;
        while (l < r) {
            int t = arr[l]; //@swap
            arr[l] = arr[r];
            arr[r] = t;
            l++;
            r--;
        }
    }

    // Har item ko k jagah right shift karo; jo end se bahar gire wo shuru mein aaye
    static void rotateRight(int[] arr, int k) {
        int n = arr.length;
        if (n == 0) return;
        int steps = k % n; // n steps rotate karo to array wapas wahi; isliye k % n kaafi //@mod
        reverse(arr, 0, n - 1); // 1) poora array ulta //@all
        reverse(arr, 0, steps - 1); // 2) pehle 'steps' items ulte //@left
        reverse(arr, steps, n - 1); // 3) baaki items ulte //@right
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7};
        rotateRight(a, 3);
        System.out.println(Arrays.toString(a));

        int[] b = {1, 2};
        rotateRight(b, 5); // k > n: 5 % 2 = 1 step
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [5, 6, 7, 1, 2, 3, 4]
// [2, 1]
