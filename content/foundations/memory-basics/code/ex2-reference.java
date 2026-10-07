import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 3}; // heap par array, a mein uska address //@a
        int[] b = a; // copy NAHI bani! sirf address copy hua //@b
        b[0] = 99; // b ke through heap wala array badla //@write
        System.out.println(Arrays.toString(a)); // a bhi badla dikhega //@print

        int[] c = a.clone(); // ab ASLI nayi copy (naya heap block) //@copy
        c[c.length - 1] = 50; // sirf c badla //@write2
        System.out.println(Arrays.toString(a)); // a pe koi effect nahi
        System.out.println(Arrays.toString(c));
    }
}

// Output:
// [99, 2, 3]
// [99, 2, 3]
// [99, 2, 50]
