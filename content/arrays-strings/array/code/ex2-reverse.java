import java.util.Arrays;

class Main {
    // Array ko usi jagah (in-place) ulta karo - koi nayi array nahi
    static void reverse(int[] arr) {
        int l = 0; // left pointer: shuru se //@init
        int r = arr.length - 1; // right pointer: end se
        while (l < r) { // jab tak dono beech mein mil na jaayein //@loop
            int temp = arr[l]; // swap: pehle left value ko bacha lo //@swap
            arr[l] = arr[r];
            arr[r] = temp;
            l++; // dono pointer andar ki taraf //@move
            r--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        reverse(a);
        System.out.println(Arrays.toString(a));

        int[] b = {7, 8};
        reverse(b);
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [5, 4, 3, 2, 1]
// [8, 7]
