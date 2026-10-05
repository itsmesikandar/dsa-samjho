import java.util.Arrays;

class Main {
    // Har element ka square ek NAYI array mein (input ko nahi chhuna)
    static int[] squares(int[] arr) {
        int[] result = new int[arr.length]; // n naye dabbe -> O(n) extra //@alloc
        for (int i = 0; i < arr.length; i++) { // i: sirf 1 dabba -> O(1)
            result[i] = arr[i] * arr[i]; //@fill
        }
        return result; //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(squares(new int[]{3, 1, 4})));
    }
}

// Output:
// [9, 1, 16]
