import java.util.Arrays;

class Main {
    // Saare even numbers pehle, odd baad mein (order koi bhi). In-place.
    static int[] sortArrayByParity(int[] a) {
        int s = 0; // a[0 .. s-1] sab even
        for (int i = 0; i < a.length; i++) {
            if (a[i] % 2 == 0) { // even mila: even wale hisse ke end mein bhejo //@check
                int t = a[i]; //@swap
                a[i] = a[s];
                a[s] = t;
                s++;
            }
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(sortArrayByParity(new int[]{3, 1, 2, 4})));
        System.out.println(Arrays.toString(sortArrayByParity(new int[]{0})));
    }
}

// Output:
// [2, 4, 3, 1]
// [0]
